<?php

define('ROOT', dirname(__FILE__));
define('DS', DIRECTORY_SEPARATOR);

function autoload_controller($class) {
    if (strpos($class, '\\') > 0) {
        $class_path = str_replace('\\', '/', $class) . '.php';        
    } else {
        $class_path = $class . '.php';
    }
    
    if (is_file($class_path)) {
        include_once $class_path;
    }
    
    foreach (CLASS_DIRECTORIES as $dir) {
        $class_path = $dir . $class . '.php';

        if (is_file($class_path)) {
            include_once $class_path;
            break;
        }
    }
}

spl_autoload_register('autoload_controller');