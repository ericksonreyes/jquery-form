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
                ],
                'redirect' => '/dashboard'
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
                    'name' => 'John Doe',
                    'email' => 'john@example.com',
                    'created_at' => date('c')
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
                    'name' => 'John Doe',
                    'email' => 'john@example.com',
                    'created_at' => date('c')
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
                    'message' => 'Please correct the errors and try again'
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
                    ],
                    'meta' => [
                        'exception' => [
                            'type' => 'RuntimeException',
                            'message' => 'Unexpected database connection failure',
                            'file' => 'Database.php',
                            'line' => 103
                        ],
                    ]
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