<html lang="en">
<head>
    <title>jQuery Form</title>
    <link href="/assets/bootstrap.5.3.0.min.css" rel="stylesheet"/>
    <script src="/assets/bootstrap.5.3.0.min.js"></script>
    <script src="/assets/jquery.3.7.1.min.js"></script>
    <script src="/dist/jquery-form.min.js"></script>
</head>
<body class="container">

<div class="row mt-3">
    <div class="col-12">
        <h1>Normal Form</h1>
        <form action="/api/index.php?result=html" method="post" id="form_success">

            <div class="jqf-container">
                <div class="form-group mb-2">
                    <label for="name">Name</label>
                    <input type="text" name="name" id="name" class="form-control">
                </div>
                <div class="form-group mb-2">
                    <label for="email">Email</label>
                    <input type="email" name="email" id="email" class="form-control">
                </div>
                <div class="form-group mb-2">
                    <label for="message">Message</label>
                    <textarea name="message" id="message" class="form-control"></textarea>
                </div>
                <div class="form-group mb-2">
                    <label for="message">Action</label>
                    <select class="form-control url">
                        <option value="/api/index.php?result=html">/api/?result=html</option>
                        <option value="/api/index.php?result=created">/api/?result=created</option>
                        <option value="/api/index.php?result=accepted">/api/?result=accepted</option>
                        <option value="/api/index.php?result=warning">/api/?result=warning</option>
                        <option value="/api/index.php?result=error">/api/?result=error</option>
                        <option value="/api/index.php?result=error_detailed">/api/?result=error_detailed</option>
                        <option value="/api/index.php?result=load">/api/?result=load</option>
                        <option value="/api/index.php?result=redirect">/api/?result=redirect</option>
                    </select>
                </div>
                <button type="submit" class="btn btn-primary mt-3">Submit</button>
            </div>

            <div class="jqf-response">
                <div class="jqf-response-html mt-3"></div>

                <div class="mt-3 alert alert-info" role="alert">
                    <h4>Form submission in progress.</h4>
                </div>

                <div class="mt-3 alert alert-warning" role="alert">
                    <h4 class="alert-heading">Validation error</h4>
                    <p>Form validation failed.</p>
                    <div class="text-end">
                        <button type="button" class="btn btn-primary jqf-action-retry" aria-label="Retry">Retry</button>
                    </div>
                </div>

                <div class="mt-3 alert alert-danger" role="alert">
                    <h4 class="alert-heading">Server error</h4>
                    <p>Form submission failed.</p>
                    <ul>
                    </ul>
                    <div class="text-end">
                        <button type="button" class="btn btn-primary jqf-action-retry" aria-label="Okay">Ok</button>
                    </div>
                </div>

                <div class="mt-3 alert alert-success" role="alert">
                    <h4 class="alert-heading">Success!</h4>
                    <p>Form submitted successfully.</p>
                    <div class="text-end">
                        <button type="button" class="btn btn-primary me-2 jqf-action-retry" aria-label="Okay">Okay
                        </button>
                        <button type="button" class="btn btn-primary jqf-action-reset" aria-label="Create another">
                            Create another
                        </button>
                    </div>
                </div>

            </div>
        </form>
    </div>
</div>

<script>
    $(document).ready(function () {
        $('.url').on('change', function () {
            $('#form_success').attr('action', $(this).val());
        });
    });

    $('#form_success').jqueryForm({
        beforeSend: function () {
            console.log('Before submit');
            return true;
        },
        onSuccess: function (response) {
            console.log('Success', response);
        },
        onError: function (xhr, status, error) {
            console.log('Error', error);
        },
        onComplete: function () {
            console.log('Complete');
        }
    });
</script>
</body>
</html>