/**
 * jQuery Form Plugin
 * A lightweight plugin to enhance HTML forms with AJAX capabilities and callback hooks
 *
 * @author Erickson Reyes
 * @version 1.0.0
 */
(function ($) {
    'use strict';

    /**
     * jQuery Form Plugin
     * @param {Object} options - Configuration options
     * @param {Function} options.beforeSubmit - Function to run before form submission
     * @param {Function} options.success - Function to run on successful submission
     * @param {Function} options.error - Function to run on submission error
     * @param {Function} options.complete - Function to run when submission completes (success or error)
     * @param {Boolean} options.validateBeforeSubmit - Whether to validate form before submission
     * @param {String} options.method - HTTP method to use for submission (defaults to form's method)
     * @param {String} options.action - URL to submit to (defaults to form's action)
     * @param {Object} options.extraData - Additional data to include with form submission
     * @param {Boolean} options.resetOnSuccess - Whether to reset form on successful submission
     * @returns {jQuery} - The jQuery object for chaining
     */
    $.fn.jqueryForm = function (options) {
        // Default settings
        const settings = $.extend({
            beforeSend: null,
            onSuccess: null,
            onError: null,
            onComplete: null,
            validateBeforeSubmit: true,
            method: null,
            action: null,
            extraData: {},
            resetOnSuccess: false,
            processData: false,
            contentType: false,
        }, options);

        // Process each form
        return this.each(function () {
            const $form = $(this);
            let firstInvalidField = '';

            // Skip if not a form
            if (!$form.is('form')) {
                console.warn('jqueryForm: Element is not a form', $form);
                return;
            }

            // Hide all .alert in jqf-response
            $form.find('.jqf-response .alert').hide();

            // Store settings with the form
            $form.data('jqf-settings', settings);

            // Handle form submission
            $form.off('submit.jqueryForm').on('submit.jqueryForm', function (event) {
                event.preventDefault();

                const formSettings = $form.data('jqf-settings');

                // Validate before submission if required
                if (formSettings.validateBeforeSubmit && !validateForm($form)) {
                    return false;
                }

                // Call beforeSubmit callback if provided
                if (typeof formSettings.beforeSend === 'function') {
                    const shouldContinue = formSettings.beforeSend.call($form, $form);
                    if (shouldContinue === false) {
                        return false;
                    }
                }

                // Prepare form data
                const formData = new FormData($form[0]);

                // Add extra data if provided
                if (formSettings.extraData) {
                    for (const key in formSettings.extraData) {
                        formData.append(key, formSettings.extraData[key]);
                    }
                }

                // Prepare AJAX options
                const ajaxOptions = {
                    url: formSettings.action || $form.attr('action'),
                    method: formSettings.method || $form.attr('method') || 'GET',
                    data: formData,
                    processData: formSettings.processData,
                    contentType: formSettings.contentType,
                    beforeSend: function () {
                        // Show alert-info of jqf-response
                        $form.find('.jqf-response .alert-info').show('fast');
                        $form.find('.jqf-response .alert button').show();
                        firstInvalidField = $form.find('input, select, textarea').first().attr('name');
                    },
                    success: function (response, textStatus, xhr) {
                        // Hide all .alert in jqf-response
                        $form.find('.jqf-response .alert').hide();
                        $form.find('.jqf-response .jqf-response-html').empty();
                        $form.find('.jqf-response .jqf-response-html').hide();

                        // Get response content-type header from xhr
                        const contentType = xhr.getResponseHeader('Content-Type');
                        if (contentType.includes('application/json') === false) {
                            $form.find('.jqf-response .jqf-response-html').html(response);
                            $form.find('.jqf-response .jqf-response-html').show();
                            return;
                        }

                        try {
                            const json = response;
                            const httpStatus = xhr.status;

                            let title = '';
                            let message = '';
                            let redirect = '';
                            let attributes = [];

                            if (json.meta && json.meta.response) {
                                title = json.meta.response.title ?? 'Success!';
                                message = json.meta.response.message ?? 'Form submitted successfully';
                                redirect = json.meta.response.redirect ?? '';
                            }

                            if (json.data && json.data.attributes) {
                                attributes = json.data.attributes ?? [];
                            }

                            $form.find('.jqf-response .alert-success h4').text(title);
                            $form.find('.jqf-response .alert-success p').text(message);

                            if (title !== '' || message !== '') {
                                $form.find('.jqf-response .alert-success').show('fast');
                            }

                            if (httpStatus >= 200 && httpStatus < 300) {
                                // Call success callback
                                if (formSettings.resetOnSuccess) {
                                    $form[0].reset();
                                }

                                if (typeof formSettings.onSuccess === 'function') {
                                    formSettings.onSuccess.call($form, response);
                                }

                                // Traverse attributes and put the values in the form
                                for (const [field, value] of Object.entries(attributes)) {
                                    const form_element = $form.find('.jqf-container *[name="' + field + '"]');
                                    if (form_element.length > 0) {
                                        form_element.val(value);
                                    }
                                }

                                return;
                            }

                            if (httpStatus >= 300 && httpStatus < 400 && redirect !== '') {
                                $form.find('.jqf-response .alert button').hide();

                                // Redirect after 1 second
                                setTimeout(function () {
                                    window.location.href = redirect;
                                }, 1000);
                            }
                        } catch (e) {
                            // Put the content of e in alert-danger
                            $form.find('.jqf-response .alert-danger h4').text('Error parsing JSON response');
                            $form.find('.jqf-response .alert-danger p').text(e);
                            $form.find('.jqf-response .alert-danger').show('fast');
                            console.error(e);
                        }
                    },
                    error: function (xhr, status, error) {
                        // Hide all .alert in jqf-response
                        $form.find('.jqf-response .alert').hide();
                        $form.find('.jqf-response .jqf-response-html').empty();
                        $form.find('.jqf-response .jqf-response-html').hide();

                        // Get response content-type header
                        const contentType = xhr.getResponseHeader('Content-Type');
                        if (contentType.includes('application/json') === false) {
                            $form.find('.jqf-response .jqf-response-html').html(xhr.responseText);
                            return;
                        }

                        try {
                            const json = xhr.responseJSON;

                            const httpStatus = xhr.status;
                            const title = json.meta.response.title ?? 'Success!';
                            let message = json.meta.response.message ?? 'Form submitted successfully';
                            const redirect = json.meta.response.redirect ?? '';
                            const errors = json.meta.response.errors ?? [];
                            const type = json.meta.response.type ?? '';
                            const file = json.meta.response.file ?? '';
                            const line = json.meta.response.line ?? '';
                            const stack_trace = json.meta.response.stack_trace ?? [];

                            // Show the detailed error message if provided
                            if (type !== '' && file !== '' && line !== '') {
                                message = type + ' in ' + file + ' at line ' + line;
                            }

                            let alert_element = '.jqf-response .alert-warning';
                            if (httpStatus >= 500) {
                                alert_element = '.jqf-response .alert-danger';
                            }
                            $form.find(alert_element + ' ul').empty();
                            $form.find(alert_element + ' ul').hide();
                            $form.find(alert_element + ' h4').text(title);
                            $form.find(alert_element + ' p').text(message);
                            $form.find(alert_element).show('fast');

                            if (errors.length > 0 || stack_trace.length > 0) {
                                // Add errors to alert-danger
                                for (let i = 0; i < errors.length; i++) {
                                    const error = errors[i];
                                    if (firstInvalidField === '' && error.field) {
                                        firstInvalidField = error.field;
                                    }
                                    if (error.message) {
                                        const error_li = $('<li></li>');
                                        error_li.text(error.message);
                                        $form.find(alert_element + ' ul').append(error_li);
                                    }
                                }

                                const ul = $form.find(alert_element + ' ul');
                                for (let i = 0; i < stack_trace.length; i++) {
                                    const stack = stack_trace[i];
                                    const error_li = $('<li></li>');

                                    // Loop the keys and values of the stack object
                                    const stack_ul = $('<ul></ul>');
                                    for (const [key, value] of Object.entries(stack)) {
                                        const stack_li = $('<li></li>');
                                        stack_li.text(key + ': ' + value);
                                        stack_ul.append(stack_li);
                                    }

                                    error_li.append('<p>Stack trace: ' + i + '</p>');
                                    error_li.append(stack_ul);
                                    ul.append(error_li);
                                }
                                ul.show();
                            }


                            // Focus on first invalid field
                            if (httpStatus >= 400 && httpStatus < 600 && firstInvalidField) {
                                $form.find('.jqf-container input[name="' + firstInvalidField + '"]')
                                    .addClass('is-invalid');
                                $form.find('.jqf-container textarea[name="' + firstInvalidField + '"]')
                                    .addClass('is-invalid');
                                $form.find('.jqf-container select[name="' + firstInvalidField + '"]')
                                    .addClass('is-invalid');
                            }

                            if (typeof formSettings.onError === 'function') {
                                formSettings.onError.call($form, xhr, status, error);
                            }

                            if (httpStatus >= 300 && httpStatus < 400 && redirect !== '') {
                                $form.find('.jqf-response .alert button').hide();

                                // Redirect after 1 second
                                setTimeout(function () {
                                    window.location.href = redirect;
                                }, 1000);
                            }
                        } catch (e) {
                            $form.find('.jqf-response jqf-response-html').text('Error parsing JSON response');
                            $form.find('.jqf-response .alert-danger p').text(e);
                            $form.find('.jqf-response .alert-danger').show('fast');
                            console.error(e);
                        }
                    },
                    complete: function () {
                        if (typeof formSettings.onComplete === 'function') {
                            formSettings.onComplete.call($form);
                        }
                        // Scroll to jqf-response
                        $('html, body').animate({
                            scrollTop: $form.find('.jqf-response').offset().top - 100
                        }, 250);
                    }
                };

                // Submit form via AJAX
                $.ajax(ajaxOptions);
                return false;
            });

            // Handle retry button clicks
            $form.on('click', '.jqf-action-retry', function (e) {
                e.preventDefault();
                // Hide all alerts in jqf-response
                $form.find('.jqf-response .alert').hide('fast');
                $form.find('.jqf-response .jqf-response-html').empty();

                if (firstInvalidField !== '') {
                    // Focus on first invalid field
                    $form.find('.jqf-container input[name="' + firstInvalidField + '"]')
                        .focus();
                    $form.find('.jqf-container textarea[name="' + firstInvalidField + '"]')
                        .focus();
                    $form.find('.jqf-container select[name="' + firstInvalidField + '"]')
                        .focus();
                }
            });

            // Handle reset button clicks
            $form.on('click', '.jqf-action-reset', function (e) {
                e.preventDefault();
                // Reset the form
                $form[0].reset();
                // Hide all alerts in jqf-response
                $form.find('.jqf-response .alert').hide('fast');
                $form.find('.jqf-response .jqf-response-html').empty();

                if (firstInvalidField !== '') {
                    // Focus on first invalid field
                    $form.find('.jqf-container input[name="' + firstInvalidField + '"]')
                        .focus();
                    $form.find('.jqf-container textarea[name="' + firstInvalidField + '"]')
                        .focus();
                    $form.find('.jqf-container select[name="' + firstInvalidField + '"]')
                        .focus();
                }
            });
        });
    };

    /**
     * Simple form validation
     * @param {jQuery} $form - Form to validate
     * @returns {Boolean} - Whether the form is valid
     * @private
     */
    function validateForm($form) {
        let isValid = true;

        // Use HTML5 validation if available
        if ($form[0].checkValidity && !$form[0].checkValidity()) {
            isValid = false;
        }

        return isValid;
    }

    /**
     * Update plugin options for an already initialized form
     * @param {Object} newOptions - New options to apply
     * @returns {jQuery} - The jQuery object for chaining
     */
    $.fn.jqueryFormUpdate = function (newOptions) {
        return this.each(function () {
            const $form = $(this);
            const currentSettings = $form.data('jqueryForm-settings') || {};
            const updatedSettings = $.extend({}, currentSettings, newOptions);
            $form.data('jqf-settings', updatedSettings);
        });
    };

    /**
     * Reset a form and its jqueryForm state
     * @returns {jQuery} - The jQuery object for chaining
     */
    $.fn.jqueryFormReset = function () {
        return this.each(function () {
            const $form = $(this);
            $form[0].reset();

            // Move focus to the first input, select or textarea
            $form.find('input, select, textarea').first().focus();
        });
    };

})(jQuery);