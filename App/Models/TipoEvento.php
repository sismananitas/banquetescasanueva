<?php

namespace App\Models;

class TipoEvento {
    private $id;
    private $nombre;

    public function setId($id) {
        $this->id = $id;
    }

    public function setNombre($nombre) {
        $this->nombre = $nombre;
    }

    public function insert() {
        $sql = "INSERT INTO tipo_eventos VALUES (null, ?)";
        \Conexion::query($sql, [$this->nombre]);
        return true;
    }

    public function delete() {
        $sql = "DELETE FROM tipo_eventos WHERE id_tipo_evento = ?";
        \Conexion::query($sql, [$this->id]);
        return true;
    }

    public function getAll() {
        $sql = "SELECT * FROM tipo_eventos";
        return \Conexion::query($sql, [], true);
    }

    public function getOne($id) {
        $sql = "SELECT * FROM tipo_eventos WHERE id_tipo_evento = ?";
        return \Conexion::query($sql, [$id], true);
    }

    public function validar() {
        $sql = "SELECT * FROM tipo_eventos WHERE nombre_tevento = ?";
        $res = \Conexion::query($sql, [$this->nombre], true);
        
        if (count($res) > 0) {
            $res = false;
            $_SESSION['error']['msg'] = 'Ya hay un evento con ese nombre';
        } else {
            $res = true;
        }
        return $res;
    }
}