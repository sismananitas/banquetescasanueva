<?php

namespace App\Models;

class OrdenModel
{
	public function getOne($id)
	{ 
		$sql = "SELECT o.*, e.id_evento, e.title, e.evento, e.contacto, e.cord_resp, e.cord_apoyo, e.folio".
		" FROM ordenes_servicio o".
		" INNER JOIN eventos e".
		" ON o.id_evento = e.id_evento".
		" WHERE o.id_orden = :id";

		$ord = \Conexion::query($sql, $id, true);
		return $ord;
	}

	public function getExtraInputs($id_orden)
	{
		$sql = "SELECT campos.*".
		" FROM ordenes_servicio o".
		" LEFT JOIN campos_ordenes campos".
		" ON campos.id_orden = o.id_orden".
		" WHERE campos.id_orden = :id_orden";

		$ord = \Conexion::query($sql, $id_orden, true);
		return $ord;
	}

	public function getEventoId($orden_id) {
		$sql = "SELECT id_evento as evento_id FROM ordenes_servicio WHERE id_orden = ?";
		$evento = \Conexion::query($sql, [$orden_id], true, true);
		return $evento->evento_id;
	}

	/**--- OBTENER ARRAY DE LA ORDEN ---*/
	private function getArrayData()
	{
		return array(
			'id_evento'        => trim($_POST['id_evento']),
			'fecha'            => trim($_POST['fecha']) . ' ' . trim($_POST['time']),
			'orden'            => trim($_POST['nombre']),
			'garantia'         => trim($_POST['garantia']),
			'lugar'            => trim($_POST['lugar']),
			'montaje'          => trim($_POST['montaje']),
			'canapes'          => isset($_POST['canapes']) ? trim($_POST['canapes']) : '',
			'entrada'          => isset($_POST['entrada']) ? trim($_POST['entrada']) : '',
			'fuerte'           => isset($_POST['fuerte']) ? trim($_POST['fuerte']) : '',
			'postre'           => isset($_POST['postre']) ? trim($_POST['postre']) : '',
			'torna'            => isset($_POST['torna']) ? trim($_POST['torna']) : '',
			'bebidas'          => isset($_POST['bebidas']) ? trim($_POST['bebidas']) : '',
			'cocteleria'       => isset($_POST['cocteleria']) ? trim($_POST['cocteleria']) : '',
			'mezcladores'      => isset($_POST['mezcladores']) ? trim($_POST['mezcladores']) : '',
			'detalle_montaje'  => isset($_POST['detalle_montaje']) ? trim($_POST['detalle_montaje']) : '',
			'ama_llaves'       => isset($_POST['ama_llaves']) ? trim($_POST['ama_llaves']) : '',
			'chief_steward'    => isset($_POST['chief_steward']) ? trim($_POST['chief_steward']) : '',
			'mantenimiento'    => isset($_POST['mantenimiento']) ? trim($_POST['mantenimiento']) : '',
			'seguridad'        => isset($_POST['seguridad']) ? trim($_POST['seguridad']) : '',
			'proveedores'      => isset($_POST['proveedores']) ? trim($_POST['proveedores']) : '',
			'recursos_humanos' => isset($_POST['recursos_humanos']) ? trim($_POST['recursos_humanos']) : '',
			'contabilidad'     => isset($_POST['contabilidad']) ? trim($_POST['contabilidad']) : '',
			'observaciones'    => isset($_POST['observaciones']) ? trim($_POST['observaciones']) : '',
			'tipo_formato'     => isset($_POST['tipo_formato']) ? trim($_POST['tipo_formato']) : '',
			'aguas_frescas'    => isset($_POST['aguas_frescas']) ? trim($_POST['aguas_frescas']) : ''
		);
	}

	/**--- AGREGAR ORDEN ---*/
	public function agregarOrden()
	{
		$sql = "INSERT INTO ordenes_servicio
		VALUES (
			null, :id_evento, :fecha,
			:orden, :garantia,
			:lugar, :montaje,
			null, :canapes,
			:entrada, :fuerte, :postre,
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

		\Conexion::query($sql, $this->getArrayData());
	}

	/**--- ELIMINAR ORDEN ---*/
	public function eliminarOrden($id)
	{
		$sql = "DELETE FROM ordenes_servicio WHERE id_orden = :id";
		\Conexion::query($sql, ['id' => $id]);
	}

	/**--- ACTUALIZAR ORDEN ---*/
	public function modificarOrden($id)
	{
		$data = $this->getArrayData();
		$data['id'] = $id;

		$sql = "UPDATE ordenes_servicio SET
		id_evento        = :id_evento,
		fecha            = :fecha,
		orden            = :orden,
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
    	aguas_frescas    = :aguas_frescas WHERE id_orden = :id";

		\Conexion::query($sql, $data);
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

		$v = \Conexion::query($sql, $data, true, true);
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

		\Conexion::query($sql, $data_campo);
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

		\Conexion::query($sql, $data_campo);
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

		\Conexion::query($sql, [$orden_id]);
		return true;
	}

	public function cloneCampos($orden_id, $new_orden_id) {
		$sql = "INSERT INTO campos_ordenes
		(id_orden, tag, content)
		SELECT :new_orden_id, tag, content
		FROM campos_ordenes
		WHERE id_orden = :orden_id;";

		\Conexion::query($sql, ['orden_id' => $orden_id, 'new_orden_id' => $new_orden_id]);
		return true;
	}
}
