<?php

namespace App\Controllers;

use App\Models\Usuario;

class UsuariosController extends Controller
{
    /**
     * Muestra la página de administración de usuarios
     */
    public function index()
    {
        \Utils::isAdmin();
        $usu = new Usuario();
        $usuarios = $usu->all();
        return view('usuarios.usuarios', ['usuarios' => $usuarios, 'view_url' => 'usuarios']);
    }

    /**
     * Obtiene un usuario de la base de datos
     */
    public function getOne($id)
    {
        $usu = new Usuario();
        $res = $usu->getOne($id);
        return json_response($res, 200);
    }

    /**
     * Registra un usuario en la base de datos
     */
    public function add()
    {
        $usu = new Usuario();
        $res = [];

         // VALIDA LOS DATOS POR POST
         if (empty($_POST['usuario']) || empty($_POST['pass']) || empty($_POST['pass2'])) {
            $res['msg']   = 'Debes llenar todos los campos';
            $res['error'] = true;
            return json_response($res, 422);
        }

        // VALIDA LAS CONTRASEÑAS
        if ($_POST['pass'] != $_POST['pass2']) {
            $res['msg']   = 'Las contraseñas no coinciden';
            $res['error'] = true;
            return json_response($res, 422);

        } else if (strlen($_POST['pass']) < 6) {
            $res['msg']   = 'Las contraseñas deben contener al menos 6 caracteres';
            $res['error'] = true;
            return json_response($res, 422);
        }

        // SETEA EL USUARIO
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
        return json_response($res, 200);
    }

    /**
     * Actualiza un usuario en la base de datos
     */
    public function editar()
    {
        $usu = new Usuario();
        $usu->setName($_POST['usuario']);
        $res = [];
        $res['error'] = false;

        if (empty($_POST['usuario']) || empty($_POST['id'])) {
            $res['msg']   = 'Debes llenar todos los campos';
            $res['error'] = true;
            return json_response($res, 422);
        }

        /** EDITA EL USUARIO */
        $edit = $usu->editarUsuario($_POST['id'], $_POST['nivel'], $_POST['estado']);

        /** VALIDA QUE NO HAYAN ERRORES */
        if (!$edit) {
            $res['error'] = true;
            $res['msg']   = 'No se pudo editar';
            return json_response($res, 422);
        }
        return json_response($res, 200);

    }

    /**
     * Elimina un usuario de la base de datos
     */
    public function delete()
    {
        $usu = new Usuario();
        $res['error'] = false;

        if (empty($_POST['id'])) {
            $res['error'] = true;
            $res['msg']   = 'Debes llenar todos los campos';
            return json_response($res, 422);
        }

        // BORRAR EL USUARIO
        $delete = $usu->borrarUsuario($_POST['id']);

        // VARIFICA SI HAY ERRORES
        if (!$delete) {
            $res['msg']   = 'No se pudo borrar';
            $res['error'] = true;
            return $res;
        }
        return json_response($res, 200);
    }
}


 