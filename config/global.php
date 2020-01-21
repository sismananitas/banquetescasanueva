<?php

require_once __DIR__ .'\App\Core\Environment.php';

// RUTA BASE Y ABSOLUTA DE LA APLICACIÓN
define('base_url', getenv('BASE_DIR'));
define('root_dir', '');

define('TIMEZONE', 'America/Mexico_City');

// RUTAS
define('MODELS_PATH',   'app/models/');
define('VIEWS_PATH',    'public/views/');
define('PUBLIC_PATH',   'public/');
define('STORAGE_PATH',  'storage/');
define('IMAGE_PATH',    'storage/images/');
define('THUMBS_PATH',   'storage/thumbs/');
define('TEMP_PDF_PATH', 'public/templates/pdf/');
define('JS_PATH',       base_url .'public/js/');
define('CONTROLLERS',   './app/controllers');

const CLASS_DIRECTORIES = [
    'App/',
    'App/Controllers/',
    'App/Models/',
    'App/Middleware/',
    'App/Helpers/'
];