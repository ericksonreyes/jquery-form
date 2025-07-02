<html lang="en">
<head>
    <title>jQuery Form</title>
    <link href="/assets/bootstrap.5.3.0.min.css" rel="stylesheet"/>
    <script src="/assets/bootstrap.5.3.0.min.js"></script>
    <script src="/assets/jquery.3.7.1.min.js"></script>
    <script src="/dist/jquery-form.min.js"></script>
</head>
<body class="container">

<?php require_once 'header.php'; ?>

<div class="row mt-3">
    <div class="col-12">
        <h1>Form with callbacks</h1>
        <form action="/api/index.php?result=html" method="post" id="form">

            <div class="jqf-form-container">
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
                    <label for="action">Action</label>
                    <select class="form-control url" id="action">
                        <?php require_once('actions.php'); ?>
                    </select>
                </div>
                <button type="submit" class="btn btn-primary mt-3">Submit</button>
            </div>

            <div class="jqf-html-response-container"></div>

            <div class="jqf-alerts-container">
                <div class="mt-3 alert alert-info" role="alert">
                    <h4>Form submission in progress.</h4>
                </div>

                <div class="mt-3 alert alert-warning" role="alert">
                    <h4 class="alert-heading">Validation error</h4>
                    <p>Form validation failed.</p>
                    <ul>
                    </ul>
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

<div class="row mt-3">
    <div class="col-12">
        <h3>Callback log</h3>
        <ol id="callback_log"></ol>
    </div>
</div>

<script>
    $(document).ready(function () {
        $('.url').on('change', function () {
            $('#form').attr('action', $(this).val());
        });
    });
    const callback_log = $('#callback_log');

    $('#form').jqueryForm({
        beforeSend: function () {
            const now = new Date();
            callback_log.append('<li>' + now.toLocaleString() + ' - beforeSend callback was called.</li>');
        },
        onSuccess: function () {
            const now = new Date();
            callback_log.append('<li>' + now.toLocaleString() + ' - onSuccess callback was called.</li>');
        },
        onError: function () {
            const now = new Date();
            callback_log.append('<li>' + now.toLocaleString() + ' - onError callback was called.</li>');
        },
        onComplete: function () {
            const now = new Date();
            callback_log.append('<li>' + now.toLocaleString() + ' - onComplete callback was called.</li>');
        }
    });
</script>
</body>
</html>