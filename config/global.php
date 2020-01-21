<?php

//include str_replace('/', '\\', str_replace('config', '', __DIR__)) .'App\Core\Environment.php';
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ .'/..');
$dotenv->load();

// RUTA BASE Y ABSOLUTA DE LA APLICACIÓN
define('base_url', getenv('BASE_DIR'));
define('root_dir', getenv('SUB_DIR'));

define('TIMEZONE', 'America/Mexico_City');

// RUTAS
define('MODELS_PATH',   'app/models/');
define('VIEWS_PATH',    'public/views/');
define('PUBLIC_PATH',   'public/');
define('STORAGE_PATH',  'storage/');
define('IMAGE_PATH',    'storage/images/');
define('THUMBS_PATH',   'storage/thumbs/');
define('TEMP_PDF_PATH', 'public/templates/pdf/');
define('JS_PATH',       root_dir .'/public/js/');

const CLASS_DIRECTORIES = [
    'App/',
    'App/Controllers/',
    'App/Models/',
    'App/Middleware/',
    'App/Helpers/'
];