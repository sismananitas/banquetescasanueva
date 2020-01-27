<?php

namespace App\Controllers;

use App\Models\Usuario;

class UsuariosController {

    public function index() {
        \Utils::isAdmin();
        $usu = new Usuario();
        $usuarios = $usu->all();
        return view('usuarios', ['usuarios' => $usuarios]);
    }

    public function getOne($id) {
        $usu = new Usuario();
        $res = $usu->getOne($id);
        return json_response($res, 200);
    }

    public function add() {
        $usu = new Usuario();
         /** VALIDA LOS DATOS POR POST */
         if (empty($_POST['usuario']) || empty($_POST['pass']) || empty($_POST['pass2'])) {
            $res['msg']   = 'Debes llenar todos los campos';
            $res['error'] = true;
            return $res;
        }

        /** VALIDA LAS CONTRASEÑAS */
        if ($_POST['pass'] != $_POST['pass2']) {
            $res['msg']   = 'Las contraseñas no coinciden';
            $res['error'] = true;
            return $res;

        } else if (strlen($_POST['pass']) < 6) {
            $res['msg']   = 'Las contraseñas deben contener al menos 6 caracteres';
            $res['error'] = true;
            return $res;
        }

        /** SETEA EL USUARIO */
        $usu->setName($_POST['usuario']);
        $pass = sha1($_POST['pass']);
        $usu->setPass($pass);

        /** VALIDA QUE NO EXISTA OTRO USUARIO CO EN MISMO NOMBRE */
        $is_user = $usu->getByUser($_POST['usuario']);

        if (!$is_user) {
            /** INSERTA EL USUARIO */
            $usu->insertarUsuario($_POST['nivel'], $_POST['estado']);
            $res['error'] = false;

        } else {
            $res['msg']   = 'Ya existe un registro con ese nombre de usuario';
            $res['error'] = true;
        }
        return $res;
    }

    public function editar() {
        if (empty($_POST['usuario']) || empty($_POST['id'])) {
            $res['msg']   = 'Debes llenar todos los campos';
            $res['error'] = true;
            return $res;
        }

        $usu = new Usuario();
        $usu->setName($_POST['usuario']);
        /** EDITA EL USUARIO */
        $edit = $usu->editarUsuario($_POST['id'], $_POST['nivel'], $_POST['estado']);

        /** VALIDA QUE NO HAYAN ERRORES */
        if (!$edit) {
            $res['error'] = true;
            $res['msg']   = 'No se pudo editar';
            return $res;
        }
        $res['error'] = false;
        return $res;

    }

    public function delete() {
        if (empty($_POST['id'])) {
            $res['error'] = true;
            $res['msg']   = 'Debes llenar todos los campos';
            return $res;
        }

        $usu = new Usuario();
        // BORRAR EL USUARIO
        $delete = $usu->borrarUsuario($_POST['id']);

        // VARIFICA SI HAY ERRORES
        if (!$delete) {
            $res['msg']   = 'No se pudo borrar';
            $res['error'] = true;
            return $res;
        }
        $res['error'] = false;
        return $res;
    }
}


 