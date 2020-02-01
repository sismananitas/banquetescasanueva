<?php

namespace App\Controllers;

use App\Models\UsuariosModel;

class MiPerfilController extends Controller
{

    public function index() {
        \Utils::isUser();
        return view('mi_perfil.mi_perfil');
    }

    public function getMyInfo() {
        @session_start();
        $usuario = new UsuariosModel;
        $id['id'] = $_SESSION['usuario']['id_usuario'];
        $res['data'] = $usuario->getOne($id)[0];
        return json_response($res, 200);
    }

    public function update() {
        $data = array(
            'id_user'   => $_SESSION['usuario']['id_usuario'],
            'name'      => $_POST['name'],
            'last_name' => $_POST['last-name'],
            'email'     => $_POST['email'],
            'tel'       => $_POST['number']
        );

        $is_usuario = validaUsuario($data['id_user']);

        if ($is_usuario) {
            $is_data = comprobarDetalleDatos($data['id_user']);

            if ($is_data) {
                $sql = "UPDATE detalle_usuario SET
                nombre           = :name,
                apellidos        = :last_name,
                correo           = :email,
                telefono         = :tel
                WHERE id_usuario = :id_user";

                \Conexion::query($sql, $data);
                $res['msg']  = 'Se actualizarón los datos';

            } else {
                $sql = "INSERT INTO detalle_usuario
                (id_usuario, nombre, apellidos, correo, telefono)
                VALUES
                (:id_user, :name, :last_name, :email, :tel)";

                \Conexion::query($sql, $data);
                $res['msg']  = 'Se insertaron los datos';
            }
            $res['error'] = false;

        } else {
            $res['msg']   = 'El usuario ingresado no existe';
            $res['error'] = true;
        }
        return $res;
    }

    public function newPass() {
        // VALIDA LOS DATOS POR POST
        if (empty($_POST['pass']) || empty($_POST['pass1']) || empty($_POST['pass2'])) {
            $res['msg']   = 'Debes llenar todos los campos';
            $res['error'] = true;
            return $res;
        }

        $usu = new UsuariosModel();

        // VALIDA LA CONTRASEÑA
        if ($_POST['pass1'] != $_POST['pass2']) {
            $res['msg']   = 'Las contraseñas no coinciden';
            $res['error'] = true;
            return $res;

        } else if (strlen($_POST['pass1']) < 6) {
            $res['msg']   = 'Las contraseñas deben contener al menos 6 caracteres';  
            $res['error'] = true;
            return $res;
        }

        // CIFRA LAS CONTRASEÑAS
        $pass  = sha1($_POST['pass']);
        $pass1 = sha1($_POST['pass1']);
        
        // VALIDA LA AUTENTICIDAD DEL USUARIO
        $validar = $usu->validar($_SESSION['usuario']['id_usuario'], $pass);
        
        if ($validar) {
            // CAMBIA LA CONTRASEÑA
            $usu->cambiarPass($_SESSION['usuario']['id_usuario'], $pass1);
            $res['error'] = false;

        } else {
            $res['msg']   = $_SESSION['error']['msg'];
            $res['error'] = true;
            unset($_SESSION['error']);
        }
        return $res;
    }
} // FIN DE LA CLASE


/**
 *  COMPRUEBA  
 */
function comprobarDetalleDatos($username) {
    $data = array(
        'id' => $username
    );
 
    $sql = 'SELECT * FROM usuarios as u INNER JOIN detalle_usuario as d
       ON u.id_usuario = d.id_usuario WHERE u.id_usuario = :id';
 
    return \Conexion::query($sql, $data, true, true);
}
 
function validaUsuario($username)
{
    $data = array(
       'id' => $username
    );
 
    $sql = 'SELECT * FROM usuarios WHERE id_usuario = :id';
    return \Conexion::query($sql, $data, true, true);
}