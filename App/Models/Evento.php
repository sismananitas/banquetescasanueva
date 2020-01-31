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

		$params = array(
			$start,
			$end,
			$start,
			$end,
			$start,
			$end
		);

		$eventos = \Conexion::query($sql, $params, true);
		return $eventos;
	}

	/** CREA UN ARRAY DE LOS DATOS */
	private function getArrayData()
	{
		$autor = !empty($_SESSION['usuario']['nombre']) ? $_SESSION['usuario']['nombre']. ' ' .$_SESSION['usuario']['apellidos'] : $_SESSION['usuario']['username'];
		$resp = !empty($_POST['cord_resp']) ? $_POST['cord_resp'] : $autor;

		/** Elegir el status */
		$color = '#d7c735';
		$status = 'tentativo';

		switch ($_POST['color']) {
			case '#54b33d':
				$color =  '#54b33d';
				$status = 'cerrado';
				break;
			case '#f98710':
				$color =  '#f98710';
				$status = 'apartado';
				break;
			default:
				$color = '#d7c735';
				$status = 'tentativo';
				break;
		}
		
		/** Si es casa de muñecas el color es rosa */
		if ($_POST['color'] == '#54b33d' && $_POST['id_lugar'] == 4)
			$color = '#E56285';

		// LIMPIEZA DE DATOS
		$titulo     = trim($_POST['title']);
		$evento     = trim($_POST['evento']);
		$folio      = isset($_POST['folio']) ? trim($_POST['folio']) : '';
		$contacto   = trim($_POST['contacto']);
		$cord_resp  = trim($resp);
		$cord_apoyo = isset($_POST['cord_apoyo']) ? trim($_POST['cord_apoyo']) : '';
		$desc 		= isset($_POST['description']) ? trim($_POST['description']) : '';

		$array = array(
			'title'      => $titulo,
			'evento'     => mb_strtoupper($evento),
			'folio'      => $folio,
			'contacto'   => mb_strtoupper($contacto),
			'cord_resp'  => mb_strtoupper($cord_resp),
			'cord_apoyo' => mb_strtoupper($cord_apoyo),
			'des'        => $desc,
			'lugar'      => $_POST['id_lugar'],
			'start'      => trim($_POST['start']),
			'end'        => trim($_POST['end']),
			'personas'   => $_POST['personas'],
			'categoria'  => trim($_POST['categoria']),
			'color'      => $color,
			'status'	 => $status
		);
		// SOLO CIERRAN LOS EVENTOS LOS ADMINS Y SUPERVISORES
		if (
			$color != '#d7c735'
			&& strtolower($_SESSION['usuario']['rol']) != 'administrador'
			&& strtolower($_SESSION['usuario']['rol']) != 'supervisor'
		) {
			unset($array['color']);
			unset($array['status']);
		}
		return $array;
	}

	/**------ INSERTA EL EVENTO ---------*/
	public function agregarEvento()
	{
		$data               = $this->getArrayData();
		$data['id_usuario'] = $_SESSION['usuario']['id_usuario'];

		$sql = "INSERT INTO eventos VALUES (
		null, :title, :evento, :folio, :contacto, :cord_resp,
		:cord_apoyo, :des, :lugar, :start, :end, :personas,
		:categoria, :color, :id_usuario, :status)";

		\Conexion:: query($sql, $data);
	}

	/**---------- ELIMINA EL EVENTO ---------*/
	public function eliminarEvento($id)
	{
		$sql = "DELETE FROM eventos WHERE id_evento = :id";
		\Conexion::query($sql, array('id' => $id));
	}

	/**------ MODIFICA EL EVENTO --------*/
	public function modificarEvento($data)
	{
		$sql = "UPDATE eventos SET
		title = :title,
		evento = :evento,
		contacto = :contacto,
		cord_resp = :cord_resp,
		cord_apoyo = :cord_apoyo,
		description = :description,
		id_lugar = :id_lugar,
		start = :start,
		end = :end,
		personas = :personas,
		categoria = :categoria,
		folio = :folio
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
}
