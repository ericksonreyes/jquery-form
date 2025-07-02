<?php
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
    default:
        $contentType = 'text/html';
        $responseText = "<p>Hello World</p>";
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