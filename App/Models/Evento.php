<?php

namespace App\Models;

class Evento extends Model
{
	public function __construct()
	{
		parent::__construct();
		$this->primaryKey = 'id_evento';
	}

	public function getAll() {
		$sql = "SELECT * FROM eventos";
		$eventos = \Conexion::query($sql, [], true);
		return $eventos;
	}

	public function getMonth($start, $end) {

		$sql = "SELECT e.*, l.lugar FROM eventos e" .
		" INNER JOIN lugares l ON e.id_lugar = l.id_lugar" .
		" WHERE (e.start BETWEEN ? AND ? OR e.end BETWEEN ? AND ?) OR
		(? BETWEEN e.start AND e.end OR ? BETWEEN e.start AND e.end);";

		$params = [ $start, $end, $start, $end, $start, $end ];

		$eventos = \Conexion::query($sql, $params, true);
		return $eventos;
	}

	/**------ INSERTA EL EVENTO ---------*/
	public function agregar($data)
	{
		$sql = "INSERT INTO eventos VALUES (
		null, :title, :evento, :folio, :contacto, :cord_resp,
		:cord_apoyo, :description, :lugar, :start, :end, :personas,
		:categoria, :color, :id_usuario, :status
		)";

		return $this->query($sql, $data);
	}

	/**---------- ELIMINA EL EVENTO ---------*/
	public function eliminarEvento($id)
	{
		$sql = "DELETE FROM eventos WHERE id_evento = :id";
		\Conexion::query($sql, array('id' => $id));
	}

	/**------ MODIFICA EL EVENTO --------*/
	public function modificar($data)
	{
		$sql = "UPDATE eventos SET
		title = :title,
		evento = :evento,
		contacto = :contacto,
		cord_resp = :cord_resp,
		cord_apoyo = :cord_apoyo,
		description = :description,
		id_lugar = :lugar,
		start = :start,
		end = :end,
		personas = :personas,
		categoria = :categoria,
		color = :color,
		folio = :folio,
		status = :status
		WHERE id_evento = :id";
		\Conexion::query($sql, $data);
	}

	// VALIDA LAS FECHAS DE LOS EVENTOS
	public function validarFechas($start, $end) {
		// VALIDA QUE LA FECHA NO ESTÉ VACIA
		$isset_start = strpos($start, '-');
		if (!$isset_start) {
			return false;
		}
	
		$isset_end = strpos($end, '-');
		if (!$isset_end) {
			return false;
		}
		// VALIDAR FECHA DE INICIO
		$fecha_hora_init = explode(' ', $start); // SEPARO HORA Y FECHA
		$fecha_init = $fecha_hora_init[0];
		$date_ini = explode('-', $fecha_init); // SEPARO DIA MES Y AÑO
		
		$day_init = $date_ini[2];
		$month_init = $date_ini[1];
		$year_init = $date_ini[0];
	
		$validacion = checkdate($month_init, $day_init, $year_init);
	
		if (!$validacion) {
			return false;
		}
	
		// VALIDO FECHA FINAL
		$fecha_hora_end = explode(' ', $end); // SEPARO HORA Y FECHA
		$fecha_end = $fecha_hora_end[0];
		$date_end = explode('-', $fecha_end); // SEPARO DIA MES Y AÑO
		
		$day_end = $date_end[2];
		$month_end = $date_end[1];
		$year_end = $date_end[0];
	
		$validacion = checkdate($month_end, $day_end, $year_end);
	
		if (!$validacion) {
			return false;
		}
		return true;
	}

	public function getOrders()
	{
		$sql = "SELECT o.*, e.id_evento, e.title, e.evento, e.contacto, e.cord_resp, e.cord_apoyo, e.folio".
		" FROM ordenes_servicio o".
		" INNER JOIN eventos e".
		" ON o.id_evento = e.id_evento".
		" WHERE e.id_evento = ?";

		$result = $this->query($sql, [$this->id_evento], true);
		return $result;
	}
}
