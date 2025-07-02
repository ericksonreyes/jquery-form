/**
 * jQuery Form Plugin
 * A lightweight plugin to enhance HTML forms with AJAX capabilities and callback hooks
 * 
 * @author Erickson Reyes
 * @version 1.0.0
 */
(function ($) {
    'use strict'; // Ensures code runs in strict mode to catch common JavaScript pitfalls

    /**
     * jQuery Form Plugin
     * @param {Object} options - Configuration options (optional)
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
        // Ensure options is an object, defaulting to empty object if not provided
        options = options || {};
        
        // Default settings - merged with user-provided options
        const settings = $.extend({
            beforeSend: null, // Callback before sending the AJAX request
            onSuccess: null, // Callback on successful form submission
            onError: null, // Callback on error during form submission
            onComplete: null, // Callback that runs after form submission regardless of outcome
            validateBeforeSubmit: true, // Whether to use HTML5 validation before submission
            method: null, // HTTP method override (GET, POST, etc.)
            action: null, // URL override for form submission
            extraData: {}, // Additional data to send with the form
            resetOnSuccess: false, // Whether to clear form fields after successful submission
            processData: false, // Don't process data since we're using FormData
            contentType: false, // Don't set content type as FormData sets it with boundary
        }, options);

        // Process each form - plugin can be applied to multiple forms at once
        return this.each(function () {
            const $form = $(this);
            let firstInvalidField = ''; // Tracks the first field that fails validation

            // Skip if not a form - prevents errors on non-form elements
            if (!$form.is('form')) {
                console.warn('jqueryForm: Element is not a form', $form);
                return;
            }

            // Hide all .alert in jqf-alerts-container - ensures clean state before submission
            $form.find('.jqf-alerts-container .alert').hide();

            // Store settings with the form - makes them accessible in event handlers
            $form.data('jqf-settings', settings);

            // Handle form submission - main form processing logic
            $form.off('submit.jqueryForm').on('submit.jqueryForm', function (event) {
                event.preventDefault(); // Prevent the default form submission

                const formSettings = $form.data('jqf-settings'); // Retrieve current settings

                // Validate before submission if required
                if (formSettings.validateBeforeSubmit && !validateForm($form)) {
                    return false; // Stop submission if validation fails
                }

                // Call beforeSubmit callback if provided - allows custom pre-submission logic
                if (typeof formSettings.beforeSend === 'function') {
                    const shouldContinue = formSettings.beforeSend.call($form, $form);
                    if (shouldContinue === false) {
                        return false; // Allows stopping submission from callback
                    }
                }

                // Prepare form data - creates a FormData object from the form
                const formData = new FormData($form[0]);

                // Add extra data if provided - allows sending additional fields not in the form
                if (formSettings.extraData) {
                    for (const key in formSettings.extraData) {
                        formData.append(key, formSettings.extraData[key]);
                    }
                }

                // Prepare AJAX options - configures the AJAX request
                const ajaxOptions = {
                    url: formSettings.action || $form.attr('action'), // Use provided action or form's action attribute
                    method: formSettings.method || $form.attr('method') || 'GET', // Use provided method, form's method, or default to GET
                    data: formData, // The form data to submit
                    processData: formSettings.processData, // Don't convert FormData to query string
                    contentType: formSettings.contentType, // Let browser set content type with boundary
                    beforeSend: function () {
                        $form.find('.jqf-alerts-container .alert').hide();
                        $form.find('.jqf-html-response-container').empty();
                        $form.find('.jqf-html-response-container').hide();

                        // Show alert-info of jqf-alerts-container - indicates form is being submitted
                        $form.find('.jqf-alerts-container .alert-info').show('fast');
                        $form.find('.jqf-alerts-container .alert button').show();
                        firstInvalidField = $form.find('input, select, textarea').first().attr('name'); // Store first field for focus on error
                    },
                    success: function (response, textStatus, xhr) {
                        // Get response content-type header from xhr - determines how to process response
                        const contentType = xhr.getResponseHeader('Content-Type');
                        if (contentType.includes('application/json') === false) {
                            // Handle non-JSON response - display as HTML
                            $form.find('.jqf-html-response-container').html(response).show('fast');

                            // Call onSuccess callback if provided
                            if (typeof formSettings.onSuccess === 'function') {
                                formSettings.onSuccess.call($form, response); // Call success callback
                            }

                            return;
                        }

                        try {
                            const json = response; // Parse JSON response
                            const httpStatus = xhr.status; // Get HTTP status code

                            let title = '';
                            let message = '';
                            let redirect = '';
                            let attributes = [];

                            // Extract response metadata if available
                            if (json.meta && json.meta.response) {
                                title = json.meta.response.title ?? 'Success!'; // Default title if not provided
                                message = json.meta.response.message ?? 'Form submitted successfully'; // Default message if not provided
                                redirect = json.meta.response.redirect ?? ''; // URL to redirect to if provided
                            }

                            // Extract attributes to update form fields if available
                            if (json.data && json.data.attributes) {
                                attributes = json.data.attributes ?? [];
                            }

                            // Update success alert with response information
                            $form.find('.jqf-alerts-container .alert-success h4').text(title);
                            $form.find('.jqf-alerts-container .alert-success p').text(message);

                            if (title !== '' || message !== '') {
                                $form.find('.jqf-alerts-container .alert-success').show('fast'); // Show success message if provided
                            }

                            // Call onSuccess callback if provided
                            if (typeof formSettings.onSuccess === 'function') {
                                formSettings.onSuccess.call($form, response); // Call success callback
                            }

                            if (httpStatus >= 200 && httpStatus < 300) {
                                // Handle successful response (2xx status codes)
                                if (formSettings.resetOnSuccess) {
                                    $form[0].reset(); // Reset form fields if configured
                                }

                                // Traverse attributes and put the values in the form - updates form fields with server response
                                for (const [field, value] of Object.entries(attributes)) {
                                    const form_element = $form.find('.jqf-form-container *[name="' + field + '"]');
                                    if (form_element.length > 0) {
                                        form_element.val(value);
                                    }
                                }

                                return;
                            }

                            if (httpStatus >= 300 && httpStatus < 400 && redirect !== '') {
                                // Handle redirect responses (3xx status codes)
                                $form.find('.jqf-alerts-container .alert button').hide();

                                // Redirect after 1 second - gives user time to see the message
                                setTimeout(function () {
                                    window.location.href = redirect;
                                }, 1000);
                            }
                        } catch (e) {
                            // Handle JSON parsing errors
                            $form.find('.jqf-alerts-container .alert-danger h4').text('Error parsing JSON response');
                            $form.find('.jqf-alerts-container .alert-danger p').text(e);
                            $form.find('.jqf-alerts-container .alert-danger').show('fast');
                            console.error(e);
                        }
                    },
                    error: function (xhr, status, error) {
                        // Handle AJAX errors or non-2xx HTTP status codes

                        // Get response content-type header - determines how to process response
                        const contentType = xhr.getResponseHeader('Content-Type');
                        if (contentType.includes('application/json') === false) {
                            // Handle non-JSON error response - display as HTML
                            let responseText = xhr.responseText;

                            // Get only response within the <body> tag if there is one
                            const bodyStart = responseText.indexOf('<body>');
                            const bodyEnd = responseText.indexOf('</body>');
                            if (bodyStart !== -1 && bodyEnd !== -1) {
                                responseText = responseText.substring(bodyStart, bodyEnd + 7);
                            }

                            $form.find('.jqf-html-response-container').html(responseText).show('fast');
                            return;
                        }

                        try {
                            const json = xhr.responseJSON; // Parse JSON error response

                            const httpStatus = xhr.status; // Get HTTP status code
                            const title = json.meta.response.title ?? 'Success!'; // Extract title from response
                            let message = json.meta.response.message ?? 'Form submitted successfully'; // Extract message from response
                            const redirect = json.meta.response.redirect ?? ''; // Extract redirect URL if provided
                            const errors = json.meta.response.errors ?? []; // Extract validation errors if provided
                            const type = json.meta.response.type ?? ''; // Extract error type if provided
                            const file = json.meta.response.file ?? ''; // Extract error file if provided
                            const line = json.meta.response.line ?? ''; // Extract error line if provided
                            const stack_trace = json.meta.response.stack_trace ?? []; // Extract stack trace if provided

                            // Show the detailed error message if provided - helps with debugging
                            if (type !== '' && file !== '' && line !== '') {
                                message = type + ' in ' + file + ' at line ' + line;
                            }

                            // Select appropriate alert type based on status code
                            let alert_element = '.jqf-alerts-container .alert-warning'; // 4xx errors use warning style
                            if (httpStatus >= 500) {
                                alert_element = '.jqf-alerts-container .alert-danger'; // 5xx errors use danger style
                            }
                            $form.find(alert_element + ' ul').empty();
                            $form.find(alert_element + ' ul').hide();
                            $form.find(alert_element + ' h4').text(title);
                            $form.find(alert_element + ' p').text(message);
                            $form.find(alert_element).show('fast');

                            if (errors.length > 0 || stack_trace.length > 0) {
                                // Display validation errors or stack trace in a list
                                for (let i = 0; i < errors.length; i++) {
                                    const error = errors[i];
                                    if (firstInvalidField === '' && error.field) {
                                        firstInvalidField = error.field; // Store first invalid field for focusing
                                    }
                                    if (error.message) {
                                        const error_li = $('<li></li>');
                                        error_li.text(error.message);
                                        $form.find(alert_element + ' ul').append(error_li);
                                    }
                                }

                                const ul = $form.find(alert_element + ' ul');
                                for (let i = 0; i < stack_trace.length; i++) {
                                    // Display stack trace details - useful for debugging server errors
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


                            // Focus on first invalid field - improves UX for form validation errors
                            if (httpStatus >= 400 && httpStatus < 600 && firstInvalidField) {
                                $form.find('.jqf-form-container input[name="' + firstInvalidField + '"]')
                                    .addClass('is-invalid');
                                $form.find('.jqf-form-container textarea[name="' + firstInvalidField + '"]')
                                    .addClass('is-invalid');
                                $form.find('.jqf-form-container select[name="' + firstInvalidField + '"]')
                                    .addClass('is-invalid');
                            }

                            if (typeof formSettings.onError === 'function') {
                                formSettings.onError.call($form, xhr, status, error); // Call error callback
                            }

                            if (httpStatus >= 300 && httpStatus < 400 && redirect !== '') {
                                // Handle redirect responses (3xx status codes) with error
                                $form.find('.jqf-alerts-container .alert button').hide();

                                // Redirect after 1 second - gives user time to see the message
                                setTimeout(function () {
                                    window.location.href = redirect;
                                }, 1000);
                            }
                        } catch (e) {
                            // Handle JSON parsing errors in error response
                            $form.find('.jqf-alerts-container jqf-html-response-container').text('Error parsing JSON response');
                            $form.find('.jqf-alerts-container .alert-danger p').text(e);
                            $form.find('.jqf-alerts-container .alert-danger').show('fast');
                            console.error(e);
                        }
                    },
                    complete: function () {
                        $form.find('.jqf-alerts-container .alert-info').hide();

                        // Actions to perform regardless of success or failure
                        if (typeof formSettings.onComplete === 'function') {
                            formSettings.onComplete.call($form); // Call complete callback
                        }
                        // Scroll to jqf-alerts-container - ensures user sees feedback
                        $('html, body').animate({
                            scrollTop: $form.find('.jqf-alerts-container').offset().top - 100
                        }, 250);
                    }
                };

                // Submit form via AJAX - initiates the form submission
                $.ajax(ajaxOptions);
                return false;
            });

            // Handle retry button clicks - allows user to try again after errors
            $form.on('click', '.jqf-action-retry', function (e) {
                e.preventDefault();
                // Hide all alerts in jqf-alerts-container - clears error messages
                $form.find('.jqf-alerts-container .alert').hide('fast');
                $form.find('.jqf-html-response-container').empty();

                if (firstInvalidField !== '') {
                    // Focus on first invalid field - improves UX
                    $form.find('.jqf-form-container input[name="' + firstInvalidField + '"]')
                        .focus();
                    $form.find('.jqf-form-container textarea[name="' + firstInvalidField + '"]')
                        .focus();
                    $form.find('.jqf-form-container select[name="' + firstInvalidField + '"]')
                        .focus();
                }
            });

            // Handle reset button clicks - resets form to initial state
            $form.on('click', '.jqf-action-reset', function (e) {
                e.preventDefault();
                // Reset the form - clears all form fields
                $form[0].reset();
                // Hide all alerts in jqf-alerts-container - clears messages
                $form.find('.jqf-alerts-container .alert').hide('fast');
                $form.find('.jqf-html-response-container').empty();

                if (firstInvalidField !== '') {
                    // Focus on first invalid field - improves UX
                    $form.find('.jqf-form-container input[name="' + firstInvalidField + '"]')
                        .focus();
                    $form.find('.jqf-form-container textarea[name="' + firstInvalidField + '"]')
                        .focus();
                    $form.find('.jqf-form-container select[name="' + firstInvalidField + '"]')
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

        // Use HTML5 validation if available - leverages browser's built-in validation
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
            const currentSettings = $form.data('jqueryForm-settings') || {}; // Get current settings
            const updatedSettings = $.extend({}, currentSettings, newOptions); // Merge with new options
            $form.data('jqf-settings', updatedSettings); // Store updated settings
        });
    };

    /**
     * Reset a form and its jqueryForm state
     * @returns {jQuery} - The jQuery object for chaining
     */
    $.fn.jqueryFormReset = function () {
        return this.each(function () {
            const $form = $(this);
            $form[0].reset(); // Reset the native form

            // Move focus to the first input, select or textarea - improves UX
            $form.find('input, select, textarea').first().focus();
        });
    };

})(jQuery); // Self-executing function with jQuery as parameter