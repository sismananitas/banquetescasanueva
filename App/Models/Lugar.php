<?php

namespace App\Models;

class Lugar extends Model
{
    public function getAll() {
        $sql = "SELECT * FROM lugares";
        $res = \Conexion::query($sql, [], true);
        return $res;
    }
    
    public function validar($lugar) {
        $sql = "SELECT id_lugar FROM lugares WHERE lugar = ?";
        $res = \Conexion::query($sql, [$lugar], true);

        if (count($res) > 0) {
            $res = false;
            $_SESSION['error']['msg'] = 'Ya existe un lugar con ese nombre';
        } else {
            $res = true;
        }
        return $res;
    }
}