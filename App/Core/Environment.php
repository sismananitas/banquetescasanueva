<?php
// Configuración de las variables de entorno

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ .'/../..');
$dotenv->load();