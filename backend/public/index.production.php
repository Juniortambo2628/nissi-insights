<?php

use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

// Production paths - Laravel app lives at ../../nissi-insights-core relative to this file
$appBase = __DIR__ . '/../../nissi-insights-core';

// Determine if the application is in maintenance mode...
if (file_exists($maintenance = $appBase.'/storage/framework/maintenance.php')) {
    require $maintenance;
}

// Register the Composer autoloader...
require $appBase.'/vendor/autoload.php';

// Bootstrap Laravel and handle the request...
(require_once $appBase.'/bootstrap/app.php')
    ->handleRequest(Request::capture());
