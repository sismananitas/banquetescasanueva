<?php

namespace App\Models;

class Orden extends Model
{

	public function __construct()
	{
		parent::__construct();
		$this->table = 'ordenes_servicio';
		$this->primaryKey = 'id_orden';
	}

	public function showWithEvent()
	{ 
		$id = $this->id_orden;

		$sql = "SELECT o.*, e.id_evento, e.title, e.evento, e.contacto, e.cord_resp, e.cord_apoyo, e.folio".
		" FROM ordenes_servicio o".
		" INNER JOIN eventos e".
		" ON o.id_evento = e.id_evento".
		" WHERE o.id_orden = ?";

		$ord = $this->query($sql, [$id], true, true);
		return $ord;
	}

	public function getExtraInputs($id_orden)
	{
		$sql = "SELECT campos.*".
		" FROM ordenes_servicio o".
		" LEFT JOIN campos_ordenes campos".
		" ON campos.id_orden = o.id_orden".
		" WHERE campos.id_orden = :id_orden";

		$ord = $this->query($sql, $id_orden, true);
		return $ord;
	}

	public function getEventoId($orden_id) {
		$sql = "SELECT id_evento as evento_id FROM ordenes_servicio WHERE id_orden = ?";
		$evento = $this->query($sql, [$orden_id], true, true);
		return $evento->evento_id;
	}

	/**--- AGREGAR ORDEN ---*/
	public function insertar($data)
	{
		$sql = "INSERT INTO ordenes_servicio
		VALUES (
			null, :id_evento,
			:fecha, :nombre_orden,
			:garantia, :lugar,
			:montaje, null,
			:canapes, :entrada,
			:fuerte, :postre,
			:torna, :bebidas,
			:cocteleria, :mezcladores,
			:detalle_montaje,
			:ama_llaves, :chief_steward,
			:mantenimiento,
			:seguridad, :proveedores,
			:recursos_humanos,
			:contabilidad, :observaciones,
			:tipo_formato,
			:aguas_frescas
		)";

		$this->query($sql, $data);
	}

	/**--- ELIMINAR ORDEN ---*/
	public function eliminarOrden($id)
	{
		$sql = "DELETE FROM ordenes_servicio WHERE id_orden = :id";
		$this->query($sql, ['id' => $id]);
	}

	/**--- ACTUALIZAR ORDEN ---*/
	public function modificar($data)
	{
		$sql = "UPDATE ordenes_servicio SET
		id_evento        = :id_evento,
		fecha            = :fecha,
		orden			 = :nombre_orden,
		garantia         = :garantia,
		lugar            = :lugar,
		montaje          = :montaje,
		canapes          = :canapes,
		entrada          = :entrada,
		fuerte           = :fuerte,
		postre           = :postre,
		torna            = :torna,
		bebidas          = :bebidas,
		cocteleria       = :cocteleria,
		mezcladores      = :mezcladores,
		detalle_montaje  = :detalle_montaje,
		ama_llaves       = :ama_llaves,
		chief_steward    = :chief_steward,
		mantenimiento    = :mantenimiento,
		seguridad        = :seguridad,
		recursos_humanos = :recursos_humanos,
		proveedores      = :proveedores,
		contabilidad     = :contabilidad,
		observaciones    = :observaciones,
		tipo_formato     = :tipo_formato,
    	aguas_frescas    = :aguas_frescas
		WHERE id_orden = :id";

		$this->query($sql, $data);
	}

	/**--- VALIDA EL AUTOR DEL EVENTO ---*/
	public function validaUsuarioEvento($id_evento)
	{
		$data = [
			'id_usu'    => $_SESSION['usuario']['id_usuario'],
			'id_evento' => $id_evento
		];

		$sql = "SELECT COUNT(*) as 'num' FROM eventos
    	WHERE id_usuario = :id_usu AND id_evento = :id_evento";

		$v = $this->query($sql, $data, true, true);
		return $v->num;
	}

	/**--- AGREGA CAMPOS ESTRA A LA ORDEN ---*/
	public function agregarCampoExtra($id_orden, $tag, $cont)
	{
		$data_campo = [
			'id_orden' => $id_orden,
			'tag'      => $tag,
			'content'  => $cont
		];

		$sql = "INSERT INTO campos_ordenes 
		(id_orden, tag, content)
		VALUES
		(:id_orden, :tag, :content)";

		$this->query($sql, $data_campo);
	}

	/**--- EDITA LOS CAMPOS EXTRA DE LA ORDEN ---*/
	public function editarCampoExtra($id_campo, $tag, $cont)
	{
		$data_campo = [
			'id_campo' => $id_campo,
			'tag'      => $tag,
			'content'  => $cont
		];

		$sql = "UPDATE campos_ordenes SET
		tag            = :tag,
		content        = :content
		WHERE id_campo = :id_campo";

		$this->query($sql, $data_campo);
	}

	public function cloneOrden($orden_id) {
		$sql = "INSERT INTO ordenes_servicio (
			`id_evento`, `fecha`,
			`orden`, `garantia`,
			`lugar`, `montaje`,
			`nota`, `canapes`,
			`entrada`, `fuerte`,
			`postre`, `torna`,
			`bebidas`, `cocteleria`,
			`mezcladores`, `detalle_montaje`,
			`ama_llaves`, `chief_steward`,
			`mantenimiento`, `seguridad`,
			`proveedores`, `recursos_humanos`,
			`contabilidad`, `observaciones`,
			`tipo_formato`, `aguas_frescas`
		)
		SELECT 
		`id_evento`, `fecha`,
		`orden`, `garantia`,
		`lugar`, `montaje`,
		`nota`, `canapes`,
		`entrada`, `fuerte`,
		`postre`, `torna`,
		`bebidas`, `cocteleria`,
		`mezcladores`, `detalle_montaje`,
		`ama_llaves`, `chief_steward`,
		`mantenimiento`, `seguridad`,
		`proveedores`, `recursos_humanos`,
		`contabilidad`, `observaciones`,
		`tipo_formato`, `aguas_frescas`
		FROM ordenes_servicio
		WHERE id_orden = ?";

		$this->query($sql, [$orden_id]);
		return true;
	}

	public function cloneCampos($orden_id, $new_orden_id) {
		$sql = "INSERT INTO campos_ordenes
		(id_orden, tag, content)
		SELECT :new_orden_id, tag, content
		FROM campos_ordenes
		WHERE id_orden = :orden_id;";

		$this->query($sql, ['orden_id' => $orden_id, 'new_orden_id' => $new_orden_id]);
		return true;
	}
}
