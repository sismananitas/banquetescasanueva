<?php

// INDEX
$router->add('/', 'IndexController@index');

// MENU PRINCIPAL
$router->add('/menu', 'MenuController@index');

// CALENDARIO
$router->add('/calendario', 'CalendarioController@index');

// EVENTOS
$router->add('/eventos', 'EventosController@index');

$router->add('/eventos/get-all', 'EventosController@getEventos');

$router->add('/eventos/get-ingreso', 'EventosController@getIngreso');

$router->add('/eventos/crear', 'EventosController@store');

$router->add('/eventos/editar', 'EventosController@update');

$router->add('/eventos/eliminar', 'EventosController@delete');

// Logística
$router->add('/eventos/logistica', 'EventosController@getLogistica');

$router->add('/logistica/get-one/:id', 'LogisticaController@getOne');

$router->add('/logistica/add', 'LogisticaController@store');

$router->add('/logistica/edit', 'LogisticaController@update');

$router->add('/logistica/del', 'LogisticaController@destroy');

// Ordenes de Servicio
$router->add('/eventos/ordenes', 'EventosController@getOrders');

$router->add('/ordenes/get-one/:id', 'OrdenesController@show');

$router->add('/ordenes/get-campos/:id_orden', 'OrdenesController@getCampos');

$router->add('/ordenes/add', 'OrdenesController@create');

$router->add('/ordenes/edit', 'OrdenesController@update');

$router->add('/ordenes/del', 'OrdenesController@delete');

$router->add('/ordenes/print/:id', 'OrdenesController@printOne');

$router->add('/ordenes/clone', 'OrdenesController@cloneOne');

// LUGARES
$router->add('/lugares/todos', 'LugaresController@getLugares');

// USARIOS
$router->add('/sesion/iniciar', 'SesionController@iniciar');

$router->add('/sesion/cerrar', 'SesionController@cerrar');

$router->add('/usuarios', 'UsuariosController@index');

$router->add('/usuarios/get-one/:id', 'UsuariosController@getOne');

$router->add('/usuarios/add', 'UsuariosController@add');

$router->add('/usuarios/edit', 'UsuariosController@editar');

$router->add('/usuarios/del', 'UsuariosController@delete');

// ADMINISTRACIÓN
$router->add('/admin', 'AdminController@index');

// MI PERFIL
$router->add('/mi_perfil', 'MiPerfilController@index');

$router->add('/mi_perfil/get-my-info', 'MiPerfilController@getMyInfo');

$router->add('/mi_perfil/actualizar', 'MiPerfilController@update');

$router->add('/mi_perfil/new-pass', 'MiPerfilController@newPass');

// SEGUIMIENTO
$router->add('/seguimiento', 'SeguimientoController@index');

// SISTEMA
$router->add('/sistema', 'SistemaController@index');

// COTIZACIONES
$router->add('/cotizacion', 'CotizacionController@index');

$router->add('/cotizacion/get-by-event/:evento_id', 'CotizacionController@getAllByEvent');

$router->add('/cotizacion/comprobar-disp', 'CotizacionController@validar');

$router->add('/cotizacion/add', 'CotizacionController@store');

$router->add('/cotizacion/add/manual', 'CotizacionController@insertarManual');

$router->add('/cotizacion/status/update', 'CotizacionController@statusUpdate');

$router->add('/cotizacion/detalle/:id', 'CotizacionController@detalle');

$router->add('/cotizacion/detalle/get/:id', 'CotizacionController@getDetalle');

$router->add('/cotizacion/detalle/post/insert', 'CotizacionController@insertarDetalle');

$router->add('/cotizacion/print/:id', 'CotizacionController@printOne');

$router->add('/cotizacion/detalle/post/delete', 'CotizacionController@borrarDetalle');

$router->add('/cotizacion/delete/:id', 'CotizacionController@destroy');

// PRECIOS
$router->add('/precios', 'PreciosController@index');

$router->add('/precios/get-all', 'PreciosController@getAll');

$router->add('/precios/insert', 'PreciosController@insertar');

$router->add('/precios/delete', 'PreciosController@borrar');

// VENTAS
$router->add('/ventas', 'VentasController@index');

// LUGARES
$router->add('/lugares', 'LugaresController@index');

$router->add('/lugares/get-all', 'LugaresController@getLugares');

$router->add('/lugares/insert', 'LugaresController@agregar');

$router->add('/lugares/delete', 'LugaresController@eliminar');

// TIPOS DE EVENTOS
$router->add('/tipo-eventos', 'TipoEventosController@index');

$router->add('/tipo-eventos/get-all', 'TipoEventosController@getAll');

$router->add('/tipo-eventos/insert', 'TipoEventosController@insertar');

$router->add('/tipo-eventos/delete', 'TipoEventosController@eliminar');
