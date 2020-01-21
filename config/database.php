<?php

define('HOST', getenv('DB_HOST'));
define('USER', getenv('DB_USER'));
define('PASSWORD', getenv('DB_PASSWORD'));
define('DB', getenv('DB_NAME'));

$options = [
    \PDO::ATTR_ERRMODE => \PDO::ERRMODE_EXCEPTION
];

define('DB_OPTIONS', $options);