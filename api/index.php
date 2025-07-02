<?php
sleep(mt_rand(1, 5));
$httpStatus = 200;
$responseArray = [];
$responseText = '';
$contentType = 'application/json';

switch ($_GET['result']) {
    case 'redirect':
        $httpStatus = 302;
        $responseArray = [
            'data' => [],
            'meta' => [
                'response' => [
                    'title' => 'Login Success',
                    'message' => 'Redirecting to Dashboard',
                    'redirect' => '/dashboard'
                ]
            ]
        ];
        break;
    case 'load':
        $responseArray = [
            'data' => [
                'type' => 'users',
                'id' => '1',
                'attributes' => [
                    'name' => 'John Doe',
                    'email' => 'iY5m1@example.com',
                    'message' => 'Hello World',
                    'created_at' => date('c', strtotime('-2 months')),
                    'updated_at' => date('c'),
                ],
                'links' => [
                    'self' => '/api/users/1'
                ]
            ]
        ];
        break;
    case 'created':
        $httpStatus = 201;
        $responseArray = [
            'data' => [
                'type' => 'users',
                'id' => '1',
                'attributes' => [
                    'name' => $_POST['name'],
                    'email' => $_POST['email'],
                    'message' => $_POST['message'],
                    'created_at' => date('c'),
                    'updated_at' => null,
                ],
                'links' => [
                    'self' => '/api/users/1'
                ]
            ],
            'meta' => [
                'response' => [
                    'title' => 'Record Created',
                    'message' => 'The record has been created successfully',
                ]
            ]
        ];
        break;
    case 'accepted':
        $httpStatus = 202;
        $responseArray = [
            'data' => [
                'type' => 'users',
                'id' => '1',
                'attributes' => [
                    'name' => $_POST['name'],
                    'email' => $_POST['email'],
                    'message' => $_POST['message'],
                    'created_at' => date('c', strtotime('-2 months')),
                    'updated_at' => date('c'),
                ],
                'links' => [
                    'self' => '/api/users/1'
                ]
            ],
            'meta' => [
                'response' => [
                    'title' => 'Record Updated',
                    'message' => 'The record has been updated successfully',
                ]
            ]
        ];
        break;
    case 'warning':
        $httpStatus = 422;
        $responseArray = [
            'errors' => [
                [
                    'status' => '422',
                    'code' => 'InvalidArgumentException',
                    'title' => 'Validation Error',
                    'detail' => 'Name is required',
                    'source' => [
                        'pointer' => '/data/attributes/name'
                    ]
                ],
                [
                    'status' => '422',
                    'code' => 'InvalidArgumentException',
                    'title' => 'Validation Error',
                    'detail' => 'The email address is already in use',
                    'source' => [
                        'pointer' => '/data/attributes/email'
                    ]
                ],
                [
                    'status' => '422',
                    'code' => 'InvalidArgumentException',
                    'title' => 'Validation Error',
                    'detail' => 'The password must be at least 8 characters',
                    'source' => [
                        'pointer' => '/data/attributes/password'
                    ]
                ]
            ],
            'meta' => [
                'response' => [
                    'title' => 'Validation Failed',
                    'message' => 'Please correct the errors and try again',
                    'errors' => [
                        [
                            'field' => 'name',
                            'message' => 'Name is required'
                        ],
                        [
                            'field' => 'email',
                            'message' => 'The email address is already in use'
                        ],
                        [
                            'field' => 'password',
                            'message' => 'The password must be at least 8 characters'
                        ]
                    ]
                ]
            ]
        ];
        break;
    case 'error':
        $httpStatus = 500;
        $responseArray = [
            'errors' => [
                [
                    'status' => '500',
                    'code' => 'RuntimeException',
                    'title' => 'Internal Server Error',
                    'detail' => 'An unexpected error occurred while processing your request',
                    'links' => [
                        'about' => 'https://example.com/docs/errors/500'
                    ]
                ]
            ],
            'meta' => [
                'response' => [
                    'title' => 'Server Error',
                    'message' => 'We apologize for the inconvenience. Our team has been notified and is working to resolve this issue.'
                ]
            ]
        ];
        break;
    case 'error_detailed':
        $httpStatus = 500;
        $responseArray = [
            'errors' => [
                [
                    'status' => '500',
                    'code' => 'RuntimeException',
                    'title' => 'Internal Server Error',
                    'detail' => 'An unexpected error occurred while processing your request',
                    'links' => [
                        'about' => 'https://example.com/docs/errors/500'
                    ]
                ]
            ],
            'meta' => [
                'response' => [
                    'title' => 'Server Error',
                    'message' => 'We apologize for the inconvenience. Our team has been notified and is working to resolve this issue.',
                    'type' => 'RuntimeException',
                    'file' => 'Database.php',
                    'line' => 103,
                    'stack_trace' => [
                        [
                            'file' => '/var/www/html/app/Database.php',
                            'line' => 103,
                            'function' => 'connect',
                            'class' => 'Database',
                            'type' => '->'
                        ],
                        [
                            'file' => '/var/www/html/app/Models/User.php',
                            'line' => 45,
                            'function' => 'query',
                            'class' => 'Database',
                            'type' => '->'
                        ],
                        [
                            'file' => '/var/www/html/api/index.php',
                            'line' => 28,
                            'function' => 'save',
                            'class' => 'Models\User',
                            'type' => '->'
                        ]
                    ],
                ]
            ]
        ];
        break;
    case 'error_html':
        $httpStatus = 500;
        $contentType = 'text/html';

        $responseText = "
    <div id='container'>
        <h1>A PHP Error was encountered</h1>
        <p>Severity: Error</p>
        <p>Message: Example server error for jQuery Form demo</p>
        <p>Filename: api/index.php</p>
        <p>Line Number: 214</p>
        <p>Backtrace:</p>
        <code>
            File: /var/www/html/application/controllers/Api.php<br>
            Line: 214<br>
            Function: process_request<br><br>
            
            File: /var/www/html/system/core/CodeIgniter.php<br>
            Line: 532<br>
            Function: require_once<br>
        </code>
    </div>";

        if (mt_rand(0, 1) === 1) {
            $responseText = "<!DOCTYPE html>
<html lang='en'>
<head>
    <meta charset='utf-8'>
    <title>500 - Server Error</title>
    <style>
        body {
            font: 14px/20px normal Helvetica, Arial, sans-serif;
            color: #4F5155;
            margin: 0;
            padding: 0;
        }
        
        a {
            color: #003399;
            background-color: transparent;
            font-weight: normal;
        }
        
        h1 {
            color: #444;
            background-color: transparent;
            border-bottom: 1px solid #D0D0D0;
            font-size: 19px;
            font-weight: normal;
            margin: 0 0 14px 0;
            padding: 14px 15px 10px 15px;
        }
        
        code {
            font-family: Consolas, Monaco, Courier New, Courier, monospace;
            font-size: 12px;
            background-color: #f9f9f9;
            border: 1px solid #D0D0D0;
            color: #002166;
            display: block;
            margin: 14px 0 14px 0;
            padding: 12px 10px 12px 10px;
        }
        
        #container {
            margin: 10px;
            border: 1px solid #D0D0D0;
            box-shadow: 0 0 8px #D0D0D0;
        }
        
        p {
            margin: 12px 15px 12px 15px;
        }
    </style>
</head>
<body>
    <div id='container'>
        <h1>A PHP Error was encountered</h1>
        <p>Severity: Error</p>
        <p>Message: Example server error for jQuery Form demo</p>
        <p>Filename: api/index.php</p>
        <p>Line Number: 214</p>
        <p>Backtrace:</p>
        <code>
            File: /var/www/html/application/controllers/Api.php<br>
            Line: 214<br>
            Function: process_request<br><br>
            
            File: /var/www/html/system/core/CodeIgniter.php<br>
            Line: 532<br>
            Function: require_once<br>
        </code>
    </div>
</body>
</html>";
        }
        break;
    default:
        $contentType = 'text/html';
        $responseText = "<div class='mt-3 alert alert-info' role='alert'><h3>Example HTML Response</h3><p>Hello World</p></div>";
        break;
}


$response = $responseText;
if ($contentType === 'application/json') {
    $response = json_encode($responseArray, JSON_PRETTY_PRINT);
}

header('Content-Type: ' . $contentType);
http_response_code($httpStatus);
echo $response;
exit();