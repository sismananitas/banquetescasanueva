<?php

namespace App\Controllers;

use App\Models\Sesion;

class SesionController {

    public function iniciar() {
        if (empty($_POST['usuario']) || empty($_POST['pass'])) {
            $_SESSION['error']['status'] = true;
            $_SESSION['error']['msg'] = 'Debes llenar todos los campos';
            return route('/');
        }
    
        $user = $_POST['usuario'];
        $pass = sha1($_POST['pass']);
    
        $sesion = new Sesion($user, $pass);
    
        try {
            $success = $sesion->iniciarSesion();

            if (!$success) {
                throw new \PDOException('Datos de usuario incorrectos', 1000);
            }
    
        } catch (\PDOException $e) {
            $_SESSION['error']['status'] = true;
            
            if ($e->getCode() === 1000) {
                $_SESSION['error']['msg'] = $e->getMessage();
            } else {
                $_SESSION['error']['msg'] = 'Ocurrió un error interno';
                $_SESSION['error']['log'] = $e->getMessage();
            }
        }
        return route('/');
    }

    public function cerrar() {
        @session_start();
        session_destroy();
        return route('/');
    }
}