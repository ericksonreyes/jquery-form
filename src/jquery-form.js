/**
 * jQuery Form Plugin
 * A lightweight plugin to enhance HTML forms with AJAX capabilities and callback hooks
 * 
 * @author Erickson Reyes
 * @version 1.0.0
 */
(function($) {
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
    $.fn.jqueryForm = function(options) {
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
        return this.each(function() {
            const $form = $(this);
            
            // Skip if not a form
            if (!$form.is('form')) {
                console.warn('jqueryForm: Element is not a form', $form);
                return;
            }

            // Hide all .alert in jqf-response
            $form.find('.jqf-response').find('.alert').hide();

            // Store settings with the form
            $form.data('jqueryForm-settings', settings);
            
            // Handle form submission
            $form.off('submit.jqueryForm').on('submit.jqueryForm', function(event) {
                event.preventDefault();
                
                const formSettings = $form.data('jqueryForm-settings');
                
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
                    beforeSend: function() {
                        // Show alert-info of jqf-response
                        $form.find('.jqf-response .alert-info').show('fast');
                    },
                    success: function(response) {
                        // Hide all .alert in jqf-response
                        $form.find('.jqf-response .alert').hide();

                        // Show alert-success of jqf-response
                        $form.find('.jqf-response .alert-success').show('fast');

                        // Call success callback
                        if (formSettings.resetOnSuccess) {
                            $form[0].reset();
                        }

                        if (typeof formSettings.onSuccess === 'function') {
                            formSettings.onSuccess.call($form, response);
                        }
                    },
                    error: function(xhr, status, error) {
                        // Hide all .alert in jqf-response
                        $form.find('.jqf-response .alert').hide();

                        // Show alert-danger of jqf-response
                        $form.find('.jqf-response .alert-danger').show('fast');

                        if (typeof formSettings.onError === 'function') {
                            formSettings.onError.call($form, xhr, status, error);
                        }
                    },
                    complete: function() {
                        if (typeof formSettings.onComplete === 'function') {
                            formSettings.onComplete.call($form);
                        }
                    }
                };
                
                // Submit form via AJAX
                $.ajax(ajaxOptions);
                
                return false;
            });
            
            // Handle retry button clicks
            $form.on('click', '.jqf-action-retry', function(e) {
                e.preventDefault();
                // Hide all alerts in jqf-response
                $form.find('.jqf-response').find('.alert').hide();
                // Show form container
                $form.find('.jqf-container').show();
            });
            
            // Handle reset button clicks
            $form.on('click', '.jqf-action-reset', function(e) {
                e.preventDefault();
                // Reset the form
                $form[0].reset();
                // Hide all alerts in jqf-response
                $form.find('.jqf-response').find('.alert').hide();
                // Show form container
                $form.find('.jqf-container').show();
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
        
        // Add more custom validation as needed
        
        return isValid;
    }
    
    /**
     * Update plugin options for an already initialized form
     * @param {Object} newOptions - New options to apply
     * @returns {jQuery} - The jQuery object for chaining
     */
    $.fn.jqueryFormUpdate = function(newOptions) {
        return this.each(function() {
            const $form = $(this);
            const currentSettings = $form.data('jqueryForm-settings') || {};
            const updatedSettings = $.extend({}, currentSettings, newOptions);
            $form.data('jqueryForm-settings', updatedSettings);
        });
    };
    
    /**
     * Reset a form and its jqueryForm state
     * @returns {jQuery} - The jQuery object for chaining
     */
    $.fn.jqueryFormReset = function() {
        return this.each(function() {
            const $form = $(this);
            $form[0].reset();
        });
    };
    
})(jQuery);