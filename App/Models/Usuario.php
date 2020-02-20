<?php

namespace App\Models;

class Usuario extends Model
{
    private $usuario;
    private $pass;

    public function __construct($usuario = '', $pass = '')
    {
        parent::__construct();
        $this->primaryKey = 'id_usuario';
        $this->usuario = $usuario;
        $this->pass    = $pass;
    }

    public function setName($usuario)
    {
        $this->usuario = $usuario;
    }

    public function setPass($pass)
    {
        $this->pass = $pass;
    }

    public function getOne($id) {
        $sql = "SELECT u.id_usuario as 'id', u.username, u.nivel, u.estado, d.*
        FROM usuarios u
        LEFT JOIN detalle_usuario d
        ON u.id_usuario = d.id_usuario
        WHERE u.id_usuario = :id";

        $res = $this->query($sql, $id, true);
        return $res;
    }

    public function getByUser($username) {
        $sql = "SELECT u.id_usuario as 'id', u.username, u.nivel, u.estado, d.* FROM usuarios u
        LEFT JOIN detalle_usuario d ON
        u.id_usuario = d.id_usuario
        WHERE u.username = ?";

        $res = $this->query($sql, [$username], true);
        return $res;
    }

    /**---- INSERTAR USUARIO */
    public function insertarUsuario($nivel, $estado)
    {
        $data_usu = array(
            'usuario' => $this->usuario,
            'pass'    => $this->pass,
            'estado'  => $estado,
            'nivel'   => $nivel
        );

        if ($this->usuario == '' || $this->pass == '') {
            return false;
        }

        $sql = "INSERT INTO usuarios VALUES (null, :usuario, :pass, :nivel, :estado)";

        try {
            $this->query($sql, $data_usu);

        } catch (\PDOException $e) {
            $_SESSION['error']['msg'] = $e->getMessage();
            return false;
        }
        return true;
    }

    /**---- EDITAR USUARIO ----------*/
    public function editarUsuario($id, $nivel, $estado)
    {
        $data_usu = array(
            'usuario' => $this->usuario,
            'nivel'   => $nivel,
            'estado'  => $estado,
            'id'      => $id
        );

        if ($this->usuario == '') {
            return false;
        }
        
        $sql = "UPDATE usuarios
        SET
        username         = :usuario,
        nivel            = :nivel,
        estado           = :estado
        WHERE id_usuario = :id";

        try {
            $this->query($sql, $data_usu);

        } catch (\PDOException $e) {
            $_SESSION['error']['msg'] = $e->getMessage();
            return false;
        }
        return true;
    }

    /**----------- BORRAR USUARIO -------------*/
    public function borrarUsuario($id)
    {
        $sql = "DELETE FROM usuarios
        WHERE id_usuario = :id";

        try {
            $this->query($sql, array('id' => $id));

        } catch (\PDOException $e) {
            $_SESSION['error']['msg'] = $e->getMessage();
            return false;
        }
        return true;
    }

    /**----- CAMBIAR CONTRASEÑA ----------*/
    function cambiarPass($id_usuario, $pass) {
        $sql = 'UPDATE usuarios
        SET pass = :pass
        WHERE id_usuario = :id';

        try {
            $this->query($sql, array(
                'pass' => $pass,
                'id'   => $id_usuario
            ));

        } catch (\PDOException $e) {
            $_SESSION['error']['msg'] = $e->getMessage();
            return false;
        }
        return true;
    }

    /**----- VALIDAR AUTENTICIDAD DEL USUARIO -------*/
    function validar($id_usuario, $pass) {
        $sql = "SELECT id_usuario
        FROM usuarios
        WHERE id_usuario = :id_usuario
        AND pass = :pass";
        
        try {
            $valid = $this->query($sql, array(
                'id_usuario' => $id_usuario,
                'pass'       => $pass
            ), true);

        } catch (\PDOException $e) {
            $_SESSION['error']['msg'] = $e->getMessage();
            return false;
        }

        if (count($valid) > 0) {
            return true;
        } else {
            $_SESSION['error']['msg'] = 'Su contraseña actual es incorrecta';
            return false;
        }
    }
} // FIN DE LA CLASE