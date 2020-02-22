<?php

namespace App\Controllers;

use App\Helpers\Validator;
use App\Models\Evento;
use App\Models\Orden;
use App\Models\Logistica;
use Spipu\Html2Pdf\Html2Pdf;

class OrdenesController extends Controller
{
    public function show($request)
    {
        $orden = new Orden;
        $o = $orden->find($request['id']);
        $res['order'] = $o->showWithEvent();
        return $res;
    }

    public function getCampos($id)
    {
        $orden = new Orden;
        $res   = $orden->getExtraInputs($id);
        return $res;
    }

    public function store()
    {
        $orden = new Orden;
        $data = $_POST;
        $auth = $_SESSION['usuario'];
        $event = new Evento;
        $event = $event->find($data['id_evento']);
        $not_session = \Utils::validate_session();
        
        // Valida la sesión
        if ($not_session) {
            return $not_session;
        }

        $data['fecha'] = trim($_POST['fecha']) . ' ' . trim($_POST['time']);
        unset($data['id']);
        unset($data['time']);
        unset($data['tag']);
        unset($data['content']);
        $data['canapes']          = isset($_POST['canapes']) ? trim($_POST['canapes']) : '';
        $data['entrada']          = isset($_POST['entrada']) ? trim($_POST['entrada']) : '';
        $data['fuerte']           = isset($_POST['fuerte']) ? trim($_POST['fuerte']) : '';
        $data['postre']           = isset($_POST['postre']) ? trim($_POST['postre']) : '';
        $data['torna']            = isset($_POST['torna']) ? trim($_POST['torna']) : '';
        $data['bebidas']          = isset($_POST['bebidas']) ? trim($_POST['bebidas']) : '';
        $data['cocteleria']       = isset($_POST['cocteleria']) ? trim($_POST['cocteleria']) : '';
        $data['mezcladores']      = isset($_POST['mezcladores']) ? trim($_POST['mezcladores']) : '';
        $data['chief_steward']    = isset($_POST['chief_steward']) ? trim($_POST['chief_steward']) : '';
        $data['seguridad']        = isset($_POST['seguridad']) ? trim($_POST['seguridad']) : '';
        $data['proveedores']      = isset($_POST['proveedores']) ? trim($_POST['proveedores']) : '';
        $data['recursos_humanos'] = isset($_POST['recursos_humanos']) ? trim($_POST['recursos_humanos']) : '';
        $data['contabilidad']     = isset($_POST['contabilidad']) ? trim($_POST['contabilidad']) : '';
        $data['aguas_frescas']    = isset($_POST['aguas_frescas']) ? trim($_POST['aguas_frescas']) : '';
        
        // Validar datos post
        $validator = new Validator($data);
        $validated = $validator->validate([
            'id_evento'    => 'required',
            'nombre_orden' => 'required',
            'lugar'        => 'required',
            'montaje'      => 'required',
            'garantia'     => 'required',
        ]);

        if ($validated['status'] == 422) {
            return json_response($validated['data'], 422);
        }

        /** VALIDA LOS CAMPOS EXTRA */
        if (isset($_POST['tag'])) {
            $tag     = $_POST['tag'];
            $content = $_POST['content'];

            for ($i = 0; $i < sizeof($tag); $i++) {
                if (empty($tag[$i]) || empty($content[$i])) {
                    $res['message'] = 'Error en los datos';
                    $res['errors'] = ['fields' => 'No puede enviar campos extra vacios'];
                    return json_response($res, 422);
                }
            }
        }

        /** VALIDA EL AUTOR DEL EVENTO */
        if ($event->id_usuario != $auth['id_usuario'] && $auth['rol'] != 'Administrador') {
            return json_response([
                'data' => [
                    'message' => 'No tiene permiso de editar este evento'
                ]
            ], 401);
        }
        
        try {
            \Conexion::beginTransaction();

            /** INSERTA UNA ORDEN DE SERVICIO */
            $orden->insertar($data);
            $orden_id = \Conexion::lastInsertId();

            if (isset($_POST['tag'])) {
                $tag     = $_POST['tag'];
                $content = $_POST['content'];

                for ($i = 0; $i < sizeof($tag); $i++) {
                    $orden->agregarCampoExtra($orden_id, $tag[$i], $content[$i]);
                }
            }

        } catch (\PDOException $e) {
            \Conexion::rollBack();
            $res['message'] = 'No se pudo registrar la orden';
            $res['code']    = $e->getMessage();
            $res['data']    = $data;
            /** ATRAPA LOS ERRORES Y REVIERTE LOS CAMBIOS */
            return json_response($res, 500);
        }

        /** CONFIRMA LOS CAMBIOS */
        \Conexion::commit();
        $res['success'] = 'Orden registrada correctamente';
        return json_response($res, 200);
    }

    public function update()
    {
        $orden = new Orden;
        $data = $_POST;
        $auth = $_SESSION['usuario'];
        $event = new Evento;
        $event = $event->find($data['id_evento']);
        $not_session = \Utils::validate_session();
        // Validar sesión
        if ($not_session) {
            return $not_session;
        }

        $data['fecha'] = trim($_POST['fecha']) . ' ' . trim($_POST['time']);
        unset($data['time']);
        unset($data['tag']);
        unset($data['content']);
        unset($data['id_campo']);
        $data['canapes']          = isset($_POST['canapes']) ? trim($_POST['canapes']) : '';
        $data['entrada']          = isset($_POST['entrada']) ? trim($_POST['entrada']) : '';
        $data['fuerte']           = isset($_POST['fuerte']) ? trim($_POST['fuerte']) : '';
        $data['postre']           = isset($_POST['postre']) ? trim($_POST['postre']) : '';
        $data['torna']            = isset($_POST['torna']) ? trim($_POST['torna']) : '';
        $data['bebidas']          = isset($_POST['bebidas']) ? trim($_POST['bebidas']) : '';
        $data['cocteleria']       = isset($_POST['cocteleria']) ? trim($_POST['cocteleria']) : '';
        $data['mezcladores']      = isset($_POST['mezcladores']) ? trim($_POST['mezcladores']) : '';
        $data['chief_steward']    = isset($_POST['chief_steward']) ? trim($_POST['chief_steward']) : '';
        $data['seguridad']        = isset($_POST['seguridad']) ? trim($_POST['seguridad']) : '';
        $data['proveedores']      = isset($_POST['proveedores']) ? trim($_POST['proveedores']) : '';
        $data['recursos_humanos'] = isset($_POST['recursos_humanos']) ? trim($_POST['recursos_humanos']) : '';
        $data['contabilidad']     = isset($_POST['contabilidad']) ? trim($_POST['contabilidad']) : '';
        $data['aguas_frescas']    = isset($_POST['aguas_frescas']) ? trim($_POST['aguas_frescas']) : '';

        // Validar datos post
        $validator = new Validator($data);
        $validated = $validator->validate([
            'id_evento'    => 'required',
            'nombre_orden' => 'required',
            'lugar'        => 'required',
            'montaje'      => 'required',
            'garantia'     => 'required',
        ]);

        if ($validated['status'] == 422) {
            return json_response($validated['data'], 422);
        }

        /** VALIDA EL AUTOR DEL EVENTO */
        if ($event->id_usuario != $auth['id_usuario'] && $auth['rol'] != 'Administrador') {
            return json_response([
                'data' => [
                    'message' => 'No tiene permiso de editar este evento'
                ]
            ], 401);
        }

        /** VALIDA LOS CAMPOS EXTRA */
        if (isset($_POST['tag'])) {
            $tag     = $_POST['tag'];
            $content = $_POST['content'];

            for ($i = 0; $i < sizeof($tag); $i++) {
                if (empty($tag[$i]) || empty($content[$i])) {
                    $res['message'] = 'Error en los datos';
                    $res['errors'] = ['fields' => 'No puede enviar campos extra vacios'];
                    return json_response($res, 422);
                }
            }
        }

        try {
            /** MODIFICA LA ORDEN EN LA DB */
            $orden->modificar($data);

            if (isset($_POST['id_campo']) && isset($_POST['tag'])) {
                $id_campo = $_POST['id_campo'];
                $tag      = $_POST['tag'];
                $content  = $_POST['content'];

                for ($i = 0; $i < sizeof($id_campo); $i++) {
                    $orden->editarCampoExtra($id_campo[$i], $tag[$i], $content[$i]);
                }
            }

        } catch (\PDOException $e) {
            $res['message'] = 'No se pudo registrar la orden';
            $res['code']    = $e->getMessage();
            $res['data']    = $data;
            return json_response($res, 500);
        }

        $res['success'] = 'Actualizado correctamente';
        return json_response($res, 200);
    }

    public function destroy()
    {
        $orden = new Orden;
        $not_session = \Utils::validate_session();

        // Validar sesión
        if ($not_session) {
            return $not_session;
        }

        $valido = $orden->validaUsuarioEvento($_POST['id_evento']);
        
        try {
            if (empty($_POST['id'])) {
                throw new \Exception("No se recibió la información");
            }

            if (!$valido && $_SESSION['usuario']['rol'] != 'Administrador') {
                throw new \Exception('No tiene permiso de editar esta orden');
            }

        } catch (\Exception $e) {
            $res['message']   = $e->getMessage();
            return json_response($res, 422);
        }

        try {
            $orden->eliminarOrden($_POST['id'], $_POST['id_evento']);
            $res['success'] = 'Eliminado correctamente';
            return json_response($res, 200);

        } catch (\PDOException $e) {
            $res['message'] = 'No se pudo eliminar la orden';
            $res['log']   = $e->getMessage();
            return json_response($res, 500);
        }
    }

    public function printOne($id)
    {
        \Utils::isUser();

        /**--------- OBJETOS --------*/
        setlocale(LC_ALL, 'es_MX.utf8');
        $html      = new \Smarty();
        $html2pdf  = new Html2Pdf('L', 'A4', 'es', 'true', 'UTF-8', [3, 8, 3, 8]);
        $orden     = new Orden;
        $orden     = $orden->find($id['id']);
        $logistica = new Logistica();
        $html2pdf->pdf->SetTitle('Orden de servicio');

        /**----------- VARIABLES -------------*/
        $data_orden = $orden->showWithEvent();
        $id_evento   = $data_orden->id_evento;
        $fecha_hora  = explode(' ', $data_orden->fecha);
        $formato     = $data_orden->tipo_formato;
        $campos_dinamicos = $orden->getExtraInputs(['id_orden' => $id['id']]);

        // Obtener logística
        $actividades = $logistica->getByEvent($id_evento);

        /**------------- FECHAS EN ESPAÑOL Y CON LETRAS ------------*/
        $fecha = strftime('%A %d %B %Y', strtotime($fecha_hora[0]));
        $hora  = date('h:ia', strtotime($fecha_hora[1]));

        /**------------- VARIABLES SMARTY ---------------*/
        $html->assign('fecha', mb_strtoupper($fecha, 'UTF-8'));
        $html->assign('hora', strtoupper($hora));
        $html->assign('data', $data_orden);
        $html->assign('act', $actividades);
        $html->assign('d_data', $campos_dinamicos);

        /**-------------- ELIGE EL TIPO DE PLANTILLA ----------------*/
        $template = getTemplate($formato);

        /**-------------- MUESTRA LA PLANTILLA HTML --------------*/
        ob_start();
        $html->display(TEMP_PDF_PATH . $template);
        $html = ob_get_clean();

        /**-------------- ESCRIBE Y MUESTRA EL PDF ---------------*/
        $html2pdf->writeHTML($html);
        $html2pdf->output('Orden_de_servicio_' . date('d-m-Y') . '_' . $data_orden->orden . '.pdf');
    }

    public function cloneOne()
    {
        $orden     = new Orden;
        $not_session = \Utils::validate_session();
        // Validar sesión
        if ($not_session) {
            return $not_session;
        }
        $orden_id     = $_POST['orden_id'];
        $res['error'] = true;

        if ($orden_id) {
            $evento_id = $orden->getEventoId($orden_id);
            $valido    = $orden->validaUsuarioEvento($evento_id);

            if (!$valido) {
                $res['msg'] = 'No tiene permiso de editar este evento';
                return json_response($res);
            }

            $clone        = $orden->cloneOrden($orden_id);
            $new_orden_id = \Conexion::lastInsertId();
            $orden->cloneCampos($orden_id, $new_orden_id);

            if ($clone) {
                $res['msg']   = 'Clonado correctamente Orden: '. $orden_id . 'Evento: '. $evento_id;
                $res['error'] = false;
            } else {
                $res['msg'] = 'No se pudo clonar';
            }
        }
        return json_response($res);
    }
}


/**
 * DEVUELVE UNA PLANTILLA HTML
 *
 * @param string $formato
 * @return string $template
 */
function getTemplate($formato)
{
    switch ($formato) {
        case 'grupo':
            $template = 'orden_servicio_grupo.html';
            break;

        case 'coctel':
            $template = 'orden_servicio_coctel.html';
            break;

        case 'ceremonia':
            $template = 'orden_servicio_ceremonia.html';
            break;

        case 'banquete':
            $template = 'orden_servicio_banquete.html';
            break;
    }
    return $template;
}