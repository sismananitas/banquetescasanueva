<?php

namespace App\Models;

class Logistica extends Model
{
	public function getOne($id) {
		$sql = "SELECT * FROM sub_evento WHERE id_sub_evento = :id";
		$res = \Conexion::query($sql, $id, true);
		return $res;
	}

	public function getByEvent($id_evento) {
		
		$sql = "SELECT * FROM sub_evento WHERE id_evento = :id_evento";
		$res = \Conexion::query($sql, $id_evento, true);
		return $res;
	}

	public function getAll() {
		
		$sql = "SELECT * FROM sub_evento";
		$res = \Conexion::query($sql, [], true);
		return $res;
	}

	/**--- AGREGAR LOGISTICA ---*/
	public function agregarLogistica($datos)
	{		
		$sql = "INSERT INTO sub_evento VALUES
		(null, :id_evento, :start, null, :title, :lugar)";

		return \Conexion::query($sql, $datos);
	}

	/**--- ELIMINAR LOGISTICA ---*/
	public function eliminarLogistica($id)
	{
		$sql = "DELETE FROM sub_evento WHERE id_sub_evento = :id";
		/** ELIMINA EL REGISTRO */
		\Conexion::query($sql, array('id' => $id));
	}

	/**--- MODIFICAR LOGISTICA ---*/
	public function modificarLogistica($datos)
	{
		$sql = "UPDATE sub_evento SET
		id_evento = :id_evento,
		start     = :start,
		title     = :title,
		lugar     = :lugar
		WHERE id_sub_evento = :id";

		/** ACTUALIZA LA ACTIVIDAD */
		\Conexion::query($sql, $datos);
	}
}
