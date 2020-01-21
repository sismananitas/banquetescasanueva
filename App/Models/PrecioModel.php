<?php

namespace App\Models;

class PrecioModel {

    public function getAll() {
        $sql = "SELECT p.id_precio as 'id', p.precio_alta, p.precio_baja, t.nombre_tevento as 'evento', l.lugar
        FROM precios_renta p
        INNER JOIN tipo_eventos t ON p.id_tipo_evento = t.id_tipo_evento
        INNER JOIN lugares l ON p.id_lugar = l.id_lugar";
        $res = \Conexion::query($sql, [], true);
        return $res;
    }

    public function insertar($data) {
        $sql = "INSERT INTO precios_renta (id_tipo_evento, id_lugar, precio_alta, precio_baja)
        VALUES (:evento, :lugar, :precio_alta, :precio_baja)";

        \Conexion::query($sql, $data);
        return true;
    }

    public function validar($data) {
        $res = true;
        $sql = "SELECT id_precio FROM precios_renta WHERE id_tipo_evento = ? AND id_lugar = ?";

        $validate = \Conexion::query($sql, [$data['evento'], $data['lugar']], true);

        if (sizeof($validate) > 0) {
            $res = false;
        }
        return $res;
    }

    public function update($data) {
        $sql = "UPDATE precios_renta (id_tipo_evento, id_lugar, precio_alta, precio_baja)
        VALUES (:evento, :lugar, :precio_alta, :precio_baja)";

        \Conexion::query($sql, $data); 
        return true;
    }

    public function delete($id_precio) {
        $sql = "DELETE FROM precios_renta WHERE id_precio = ?";
        
        \Conexion::query($sql, [$id_precio]);
        return true;
    }
}