<?php

namespace App\Models;

class Logistica
{
	private $datos;

	public function __construct()
	{
		$this->datos = array();
	}

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
		/** VALIDA EL AUTOR DEL EVENTO */
		if ($this->obtenerValidacionEvento($_SESSION['usuario']['id_usuario'], $datos['id_evento'])
		|| $_SESSION['usuario']['rol'] == 'Administrador') {
			$validacion = true;

		} else { 
			$validacion = false;
		}

		/** VALIDA */
		if (!$validacion) {
			throw new \PDOException('No tiene permiso de editar este evento', 10);
			exit;
		}
		
		$sql = "INSERT INTO sub_evento VALUES
		(null, :id_evento, :start, null, :title, :lugar)";

		\Conexion::query($sql, $datos);
	}

	/**--- ELIMINAR LOGISTICA ---*/
	public function eliminarLogistica($id, $id_evento)
	{
		/** VALIDA EL AUTOR DEL EVENTO */
		if ($this->obtenerValidacionEvento($_SESSION['usuario']['id_usuario'], $id_evento)
		|| $_SESSION['usuario']['rol'] == 'Administrador') {
			$validacion = true;

		} else { 
			$validacion = false;
		}

		/** VALIDA */
		if (!$validacion) {
			throw new \PDOException('No tiene permiso de editar este evento', 10);
			exit;
		}

		$sql = "DELETE FROM sub_evento WHERE id_sub_evento = :id";
		/** ELIMINA EL REGISTRO */
		\Conexion::query($sql, array('id' => $id));
	}

	/**--- MODIFICAR LOGISTICA ---*/
	public function modificarLogistica($id, $datos)
	{
		$datos['id'] = $id;
		/** VALIDA EL AUTOR DEL EVENTO */
		if ($this->obtenerValidacionEvento($_SESSION['usuario']['id_usuario'], $datos['id_evento'])
		|| $_SESSION['usuario']['rol'] == 'Administrador') {
			$validacion = true;

		} else { 
			$validacion = false;
		}

		/** VALIDA */
		if (!$validacion) {
			throw new \PDOException('No tiene permiso de editar este evento', 10);
			return false;
		}

		$sql = "UPDATE sub_evento SET
		id_evento = :id_evento,
		start     = :start,
		title     = :title,
		lugar     = :lugar
		WHERE id_sub_evento = :id";

		/** ACTUALIZA LA ACTIVIDAD */
		\Conexion::query($sql, $datos);
	}

	/**--- VALIDA EL USUARIO ---*/
	private function obtenerValidacionEvento($id_usu, $id_evento)
	{
		$data = array(
			'id'        => $id_usu,
			'id_evento' => $id_evento
		);

		$sql = "SELECT id_usuario FROM eventos
		WHERE id_usuario = :id AND id_evento = :id_evento";

		$is_autor = \Conexion::query($sql, $data, true);

		if (count($is_autor) > 0) {
			return 1;
		} return 0;
	}
}
