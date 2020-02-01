<?php

namespace App\Models;

class EventosSql extends Model
{
   public function getOrdenSercicio($id = false)
   {
      $data = array();
      $sql  = "SELECT * FROM ordenes_servicio";

      if ($id) {
         $data = array('id' => $id);
         $sql .= " WHERE id_orden = :id";
      }
      $rows = \Conexion::query($sql, $data, true);
      return $rows;
   }

   public function getIngreso($evento_id) {
      $sql = "SELECT c.renta, SUM(d.subtotal) as 'alimentos', c.renta + SUM(d.subtotal) as 'total'
      FROM detalle_cotizacion d RIGHT JOIN cotizaciones c
      ON d.cotizacion_id = c.id
      WHERE c.evento_id = :evento_id;";

      return \Conexion::query($sql, array('evento_id' => $evento_id), true);
   }
}

?>