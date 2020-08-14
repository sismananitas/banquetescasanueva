<?php

    class Utils {
        public static function isAdmin() {
            @session_start();
            if (!isset($_SESSION['usuario']) || $_SESSION['usuario']['rol'] != 'Administrador') {
                header('location: '. base_url);
            }
        }

        public static function isSupervisor() {
            @session_start();
            if (!isset($_SESSION['usuario']) ||
            ($_SESSION['usuario']['rol'] != 'Administrador' && $_SESSION['usuario']['rol'] != 'Supervisor'))
            {
                header('location: '. base_url);
            }
        }

        public static function isVentas() {
            @session_start();
            if (!isset($_SESSION['usuario']) ||
            ($_SESSION['usuario']['rol'] != 'Administrador' && $_SESSION['usuario']['rol'] != 'Ventas') &&
            $_SESSION['usuario']['rol'] != 'Supervisor')
            {
                header('location: '. base_url);
            }
        }

        public static function isUser() {
            @session_start();
            if (!isset($_SESSION['usuario'])) {
                header('location: '. base_url);
            }
        }

        public static function validate_session() {
            @session_start();
            if (!isset($_SESSION['usuario'])) {
                $res['error'] = true;
                $res['msg'] = 'La sesión expiró, favor de recargar la página (Ctrl + R)';
                $res['code'] = 'session_expired';
                return json_response($res);
            }
            return false;
        }

        public static function getConstantSmarty($smarty_obj, $view) {
            /** CREAMOS EL OBJETO DE USARIO */
            $usuario = null;
            
            if (isset($_SESSION['usuario'])) {
                $usuario = $_SESSION['usuario'];
            }
            
            $smarty_obj->assign('base_url', base_url);
            $smarty_obj->assign('root', root_dir);
            $smarty_obj->assign('view_url', $view);
            $smarty_obj->assign('usuario', $usuario);
            
            /** RUTAS SMARTY */
            $smarty_obj->assign('views', VIEWS_PATH);
            $smarty_obj->assign('inc', VIEWS_PATH . 'includes/');
            $smarty_obj->assign('temp', base_url .'public/');
            $smarty_obj->assign('js', JS_PATH);
        }
    } // FIN DE LA CLASE