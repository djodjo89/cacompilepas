<?php

// Error handling and security
error_reporting(-1);
ini_set('display_errors', 'On');
set_error_handler("var_dump");
define ('CONST_INCLUDE', NULL);

require_once __DIR__ . '/vendor/autoload.php';
use App\Connection\Connection;
use App\Http\Router;

($connection = new Connection())::init();
$controller = new Router($connection);
$controller->redirect();
