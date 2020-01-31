<?php

    /**
     * Permite cargar una vista en un controlador
     * @param $view - Nombre de la vista
     * @param $variables - Array de variables para usar en las vistas
     * @return $smarty - Objeto smarty
     */
    function view($view, $varibles = array()) {

        // Se crea un objeto smarty para las vistas
        $smarty = new Smarty();

        Utils::getConstantSmarty($smarty, $view);
        
        // Carga las variables en la vista
        if (count($varibles) > 0) {

            // Arrary asociativo preferentemente
            foreach($varibles as $name => $value) {
                $smarty->assign($name, $value);
            }
        }

        $view = str_replace('.', '/', $view); // Reemplaza los puntos de la cadena por slashes

        // Crea la ruta de la vista
        if (is_file(VIEWS_PATH . '/' . $view . '.html')) {
            $template = VIEWS_PATH . '/' . $view . '.html';
            
        } else {
            return 'No se pudo encontrar la vista "' . VIEWS_PATH . '/' . $view . '.html"';
        }
        header('Content-Type: text/html');
        // Devuelve la vista
        return $smarty->display($template);
    }

    function route($request) {
        header('Status: 301 Moved Permanently', false, 301);
        header('Content-Type: text/html');
        header('location: ' .$request);
        exit;
    }

    function json_response($message = null, $code = 200)
    {
        // clear the old headers
        header_remove();
        // set the actual code
        http_response_code($code);
        // set the header to make sure cache is forced
        header("Cache-Control: no-transform,public,max-age=300,s-maxage=900");
        // treat this as json
        header('Content-Type: application/json');
        $status = array(
            200 => '200 OK',
            400 => '400 Bad Request',
            401 => '401 Unauthorized',
            422 => '422 Unprocessable Entity',
            500 => '500 Internal Server Error'
        );
        // ok, validation error, or failure
        header('Status: '.$status[$code]);
        // return the encoded json
        return json_encode($message);
    }
