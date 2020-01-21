<?php

	/**
	 * Front Controller
	 */

	session_start();
	require_once './vendor/autoload.php';
	require_once './config/global.php';
	require_once './config/database.php';
	require_once './App/Helpers/Functions.php';
	require_once './App/Middleware/ApiEventos.php';
	require_once 'autoload.php';
	
	date_default_timezone_set(TIMEZONE);
	$router = new Router($_SERVER['REQUEST_URI']);

	// Recibe las rutas disponibles para usar
	include_once './routes/api.php';
	include_once './routes/web.php';
	include_once './routes/meliar.php';

	$router->run();