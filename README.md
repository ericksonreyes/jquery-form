# jQuery Form Plugin

A lightweight jQuery plugin to enhance HTML forms with AJAX capabilities and callback hooks. This plugin simplifies form submissions through AJAX, handles responses elegantly, and provides a robust feedback system for users.

## Features

- **AJAX Form Submission**: Convert regular HTML forms to AJAX forms without page reloads
- **Validation Support**: Built-in HTML5 validation integration
- **Comprehensive Callbacks**: Hooks for `beforeSend`, `onSuccess`, `onError`, and `onComplete` events
- **Response Handling**: Automatic handling of JSON and HTML responses
- **User Feedback**: Built-in UI components for showing submission status, success, and error messages
- **Field Updates**: Ability to update form fields with values returned from the server
- **Redirection Support**: Automatic redirection based on server response
- **Error Handling**: Detailed error reporting with field highlighting for validation errors
- **Framework Agnostic**: Works with or without CSS frameworks, though Bootstrap 5 is recommended for optimal styling

## Installation

1. Download the [latest release](https://github.com/ericksonreyes/jquery-form/releases)
2. Include the script after jQuery:

```html
<script src="path/to/jquery.js"></script>
<script src="path/to/jquery-form.min.js"></script>
```

## Basic Usage

```javascript
$(document).ready(function() {
  $('#myForm').jqueryForm({
    // Configuration options here
    onSuccess: function(response) {
      console.log('Form submitted successfully!', response);
    }
  });
});
```

## HTML Structure Requirements

> **Note:** While the plugin works without any CSS framework, the examples use Bootstrap 5 class names (`alert`, `alert-info`, etc.) for enhanced styling. The plugin provides the best visual experience when used with Bootstrap 5, but it remains completely functional without it.

Your form should follow this structure for optimal functionality:

```html
<form action="/api/endpoint" method="post" id="myForm">
  <!-- Form container for fields -->
  <div class="jqf-form-container">
    <!-- Your form fields here -->
    <label for="name">Name</label>
    <input type="text" name="name" id="name">
    <button type="submit">Submit</button>
  </div>
    
  <!-- Response area for feedback messages -->
  <div class="jqf-alerts-container">
    <!-- Loading message -->
    <div class="alert alert-info" role="alert">
      <h4>Form submission in progress.</h4>
    </div>
    
    <!-- Warning message for validation errors -->
    <div class="alert alert-warning" role="alert">
      <h4 class="alert-heading">Validation error</h4>
      <p>Form validation failed.</p>
      <div class="text-end">
        <button type="button" class="btn btn-primary jqf-action-retry">Retry</button>
      </div>
    </div>
    
    <!-- Error message for server errors -->
    <div class="alert alert-danger" role="alert">
      <h4 class="alert-heading">Server error</h4>
      <p>Form submission failed.</p>
      <ul></ul>
      <div class="text-end">
        <button type="button" class="btn btn-primary jqf-action-retry">Ok</button>
      </div>
    </div>
    
    <!-- Success message -->
    <div class="alert alert-success" role="alert">
      <h4 class="alert-heading">Success!</h4>
      <p>Form submitted successfully.</p>
      <div class="text-end">
        <button type="button" class="btn btn-primary me-2 jqf-action-retry">Okay</button>
        <button type="button" class="btn btn-primary jqf-action-reset">Create another</button>
      </div>
    </div>
  </div>
  
    <!-- Optional HTML response container -->
  <div class="jqf-html-response-container"></div>
</form>
```

## Configuration Options

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `beforeSend` | Function | `null` | Function to run before form submission |
| `onSuccess` | Function | `null` | Function to run on successful submission |
| `onError` | Function | `null` | Function to run on submission error |
| `onComplete` | Function | `null` | Function to run when submission completes (success or error) |
| `validateBeforeSubmit` | Boolean | `true` | Whether to validate form before submission |
| `method` | String | Form's method attribute | HTTP method to use for submission |
| `action` | String | Form's action attribute | URL to submit to |
| `extraData` | Object | `{}` | Additional data to include with form submission |
| `resetOnSuccess` | Boolean | `false` | Whether to reset form on successful submission |
| `processData` | Boolean | `false` | Whether to process the data (usually false with FormData) |
| `contentType` | Boolean | `false` | Whether to set content type (usually false with FormData) |

## Expected JSON Response Format

For the best experience, your server should return JSON responses in this format:

```json
{
  "meta": {
    "response": {
      "title": "Success!",
      "message": "Your form was submitted successfully.",
      "redirect": "/optional-redirect-url"
    }
  },
  "data": {
    "attributes": {
      "field_name": "updated_value"
    }
  }
}
```

For validation error responses:

```json
{
  "meta": {
    "response": {
      "title": "Error",
      "message": "There was a problem with your submission.",
      "errors": [
        {
          "field": "email",
          "message": "Please enter a valid email address."
        }
      ]
    }
  }
}
```

For server error responses:

```json
{
  "meta": {
    "response": {
      "title": "Server Error",
      "message": "An error occurred while processing your request.",
      "type": "RuntimeException",
      "file": "/app/Controller/FormController.php",
      "line": 42,
      "stack_trace": [
        {
          "file": "/app/Controller/FormController.php",
          "line": 42,
          "function": "processForm",
          "class": "FormController"
        },
        {
          "file": "/app/index.php",
          "line": 23,
          "function": "handleRequest",
          "class": "Router"
        }
      ]
    }
  }
}
```

## Advanced Usage

### Updating Options After Initialization

```javascript
$('#myForm').jqueryFormUpdate({
  // New options
  resetOnSuccess: true
});
```

### Resetting a Form

```javascript
$('#myForm').jqueryFormReset();
```

### Multiple Forms

You can apply the plugin to multiple forms at once:

```javascript
$('form.ajax-form-1').jqueryForm({
  // Common options
});
$('form.ajax-form-2').jqueryForm();
```

## Development

### Option 1
This project includes Docker configuration for development and testing. If you have Docker installed, you can quickly set up the entire development environment using the provided installation script:

```bash
# Clone the repository
git clone https://github.com/ericksonreyes/jquery-form.git
cd jquery-form

# Run the installation script which will set up the Docker environment
# This script builds and starts the Docker containers, installs dependencies,
# and prepares the development environment
./install.sh
```

Alternatively, you can manually start the Docker environment:

```bash
# Start Docker containers
docker-compose build && docker-compose up -d app
```

The Docker setup handles all dependencies and provides a consistent development environment across different platforms.

To test, browse to [http://localhost:8888](http://localhost:8888) in your browser.

### Option 2

This project uses Gulp for building and minifying JavaScript files.

### Requirements

- Node.js and npm
- Gulp CLI

### Setup

```bash
npm install
```

### Build

```bash
npm run build
# or directly
gulp
```

### Watch for Changes

```bash
gulp watch
```

Note: When using Docker, the watch task uses relative paths (`./`) instead of absolute paths (`/`) to avoid permission issues with monitoring system directories. This is implemented in the gulpfile.js configuration:

```javascript
const options = {
    readFolder: './src',  // Using relative paths
    target: './dist'
}
```

## License

MIT License

Copyright (c) 2025 Erickson Reyes

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## Author

Erickson Reyes

## Support

Please [open an issue](https://github.com/ericksonreyes/jquery-form/issues) for support or to report bugs.
