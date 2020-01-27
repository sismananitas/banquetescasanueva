<?php

// INDEX
$router->add('/', 'App\Controllers\IndexController@index');

// MENU PRINCIPAL
$router->add('/menu', 'App\Controllers\MenuController@index');

// CALENDARIO
$router->add('/calendario', 'App\Controllers\CalendarioController@index');

// EVENTOS
$router->add('/eventos', 'App\Controllers\EventosController@index');

$router->add('/eventos/get-all', 'App\Controllers\EventosController@getEventos');

$router->add('/eventos/get-ingreso', 'App\Controllers\EventosController@getIngreso');

$router->add('/eventos/crear', 'App\Controllers\EventosController@agregar');

$router->add('/eventos/editar', 'App\Controllers\EventosController@update');

$router->add('/eventos/eliminar', 'App\Controllers\EventosController@delete');

// Logística
$router->add('/eventos/logistica', 'App\Controllers\EventosController@getLogistica');

$router->add('/logistica/get-one/:id', 'App\Controllers\LogisticaController@getOne');

$router->add('/logistica/add', 'App\Controllers\LogisticaController@create');

$router->add('/logistica/edit', 'App\Controllers\LogisticaController@editar');

$router->add('/logistica/del', 'App\Controllers\LogisticaController@delete');

// Ordenes de Servicio
$router->add('/eventos/ordenes', 'App\Controllers\EventosController@getOrden');

$router->add('/ordenes/get-one/:id', 'App\Controllers\OrdenesController@getOne');

$router->add('/ordenes/get-campos/:id_orden', 'App\Controllers\OrdenesController@getCampos');

$router->add('/ordenes/add', 'App\Controllers\OrdenesController@create');

$router->add('/ordenes/edit', 'App\Controllers\OrdenesController@editar');

$router->add('/ordenes/del', 'App\Controllers\OrdenesController@delete');

$router->add('/ordenes/print/:id', 'App\Controllers\OrdenesController@printOne');

$router->add('/ordenes/clone', 'App\Controllers\OrdenesController@cloneOne');

// LUGARES
$router->add('/lugares/todos', 'App\Controllers\LugaresController@getLugares');

// USARIOS
$router->add('/sesion/iniciar', 'App\Controllers\SesionController@iniciar');

$router->add('/sesion/cerrar', 'App\Controllers\SesionController@cerrar');

$router->add('/usuarios', 'App\Controllers\UsuariosController@index');

$router->add('/usuarios/get-one/:id', 'App\Controllers\UsuariosController@getOne');

$router->add('/usuarios/add', 'App\Controllers\UsuariosController@add');

$router->add('/usuarios/edit', 'App\Controllers\UsuariosController@editar');

$router->add('/usuarios/del', 'App\Controllers\UsuariosController@delete');

// ADMINISTRACIÓN
$router->add('/admin', 'App\Controllers\AdminController@index');

// MI PERFIL
$router->add('/mi_perfil', 'App\Controllers\MiPerfilController@index');

$router->add('/mi_perfil/get-my-info', 'App\Controllers\MiPerfilController@getMyInfo');

$router->add('/mi_perfil/actualizar', 'App\Controllers\MiPerfilController@update');

$router->add('/mi_perfil/new-pass', 'App\Controllers\MiPerfilController@newPass');

// SEGUIMIENTO
$router->add('/seguimiento', 'App\Controllers\SeguimientoController@index');

// SISTEMA
$router->add('/sistema', 'App\Controllers\SistemaController@index');

// COTIZACIONES
$router->add('/cotizacion', 'App\Controllers\CotizacionController@index');

$router->add('/cotizacion/get-by-event/:evento_id', 'App\Controllers\CotizacionController@getAllByEvent');

$router->add('/cotizacion/comprobar-disp', 'App\Controllers\CotizacionController@validar');

$router->add('/cotizacion/add', 'App\Controllers\CotizacionController@store');

$router->add('/cotizacion/add/manual', 'App\Controllers\CotizacionController@insertarManual');

$router->add('/cotizacion/status/update', 'App\Controllers\CotizacionController@statusUpdate');

$router->add('/cotizacion/detalle/:id', 'App\Controllers\CotizacionController@detalle');

$router->add('/cotizacion/detalle/get/:id', 'App\Controllers\CotizacionController@getDetalle');

$router->add('/cotizacion/detalle/post/insert', 'App\Controllers\CotizacionController@insertarDetalle');

$router->add('/cotizacion/print/:id', 'App\Controllers\CotizacionController@printOne');

$router->add('/cotizacion/detalle/post/delete', 'App\Controllers\CotizacionController@borrarDetalle');

$router->add('/cotizacion/delete/:id', 'App\Controllers\CotizacionController@destroy');

// PRECIOS
$router->add('/precios', 'App\Controllers\PreciosController@index');

$router->add('/precios/get-all', 'App\Controllers\PreciosController@getAll');

$router->add('/precios/insert', 'App\Controllers\PreciosController@insertar');

$router->add('/precios/delete', 'App\Controllers\PreciosController@borrar');

// VENTAS
$router->add('/ventas', 'VentasController@index');

// LUGARES
$router->add('/lugares', 'App\Controllers\LugaresController@index');

$router->add('/lugares/get-all', 'App\Controllers\LugaresController@getLugares');

$router->add('/lugares/insert', 'App\Controllers\LugaresController@agregar');

$router->add('/lugares/delete', 'App\Controllers\LugaresController@eliminar');

// TIPOS DE EVENTOS
$router->add('/tipo-eventos', 'App\Controllers\TipoEventosController@index');

$router->add('/tipo-eventos/get-all', 'App\Controllers\TipoEventosController@getAll');

$router->add('/tipo-eventos/insert', 'App\Controllers\TipoEventosController@insertar');

$router->add('/tipo-eventos/delete', 'App\Controllers\TipoEventosController@eliminar');
