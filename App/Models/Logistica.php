<?php

namespace App\Models;

class Logistica extends Model
{
	public function getOne($id) {
		$sql = "SELECT * FROM sub_evento WHERE id_sub_evento = :id";
		$res = $this->query($sql, $id, true);
		return $res;
	}

	public function getByEvent($id_evento) {
		
		$sql = "SELECT * FROM sub_evento WHERE id_evento = ? ORDER BY start";
		$res = $this->query($sql, [$id_evento], true);
		return $res;
	}

	public function getAll() {
		
		$sql = "SELECT * FROM sub_evento";
		$res = $this->query($sql, [], true);
		return $res;
	}

	/**--- AGREGAR LOGISTICA ---*/
	public function agregarLogistica($datos)
	{		
		$sql = "INSERT INTO sub_evento VALUES
		(null, :id_evento, :start, null, :title, :lugar)";

		return $this->query($sql, $datos);
	}

	/**--- ELIMINAR LOGISTICA ---*/
	public function eliminarLogistica($id)
	{
		$sql = "DELETE FROM sub_evento WHERE id_sub_evento = :id";
		/** ELIMINA EL REGISTRO */
		$this->query($sql, array('id' => $id));
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
		$this->query($sql, $datos);
	}
}
