<?php

namespace App\Controllers;

use App\Models\Orden;
use App\Models\Logistica;
use Spipu\Html2Pdf\Html2Pdf;

class OrdenesController extends Controller
{
    public function show($request)
    {
        $orden = new Orden;
        $o = $orden->find($request['id']);
        $res['data'] = $o->showWithEvent();
        return $res;
    }

    public function getCampos($id)
    {
        $orden = new Orden;
        $res   = $orden->getExtraInputs($id);
        return $res;
    }

    public function create()
    {
        $not_session = \Utils::validate_session();
        if ($not_session) {
            return $not_session;
        }

        try {
            /** VALIDA LOS DATOS POST */
            if (empty($_POST['id_evento']) || empty($_POST['nombre'])
            || empty($_POST['lugar']) || empty($_POST['montaje'])
            || empty($_POST['garantia'])) {
                throw new \Exception('Debe llenar los campos obligatorios');
            }
            $orden = new Orden;

            /** VALIDA EL AUTOR DEL EVENTO */
            $valido = $orden->validaUsuarioEvento($_POST['id_evento']);

            if (!$valido && $_SESSION['usuario']['rol'] != 'Administrador') {
                throw new \Exception('No tiene permiso de editar este evento');
            }

            /** VALIDA LOS CAMPOS EXTRA */
            if (isset($_POST['tag'])) {
                $tag     = $_POST['tag'];
                $content = $_POST['content'];

                for ($i = 0; $i < sizeof($tag); $i++) {
                    if (empty($tag[$i]) || empty($content[$i])) {
                        throw new \Exception('No puede enviar campos extra vacios');
                    }
                }
            }
            /** CAPTURA LOS ERRORES */
        } catch (\Exception $e) {
            $res['error'] = true;
            $res['msg']   = $e->getMessage();
            return $res;
        }

          /** INSERTA LOS REGISTROS EN LA BASE DE DATOS */
        try {
            \Conexion::beginTransaction();
            /** INSERTA UNA ORDEN DE SERVICIO */
            $orden->agregarOrden();
            $orden_id = \Conexion::lastInsertId();

            if (isset($_POST['tag'])) {
                $tag     = $_POST['tag'];
                $content = $_POST['content'];

                for ($i = 0; $i < sizeof($tag); $i++) {
                    $orden->agregarCampoExtra($orden_id, $tag[$i], $content[$i]);
                }
            }
            /** CONFIRMA LOS CAMBIOS */
            \Conexion::commit();
            $res['error'] = false;
            $res['message'] = 'Orden registrada correctamente';

            /** ATRAPA LOS ERRORES Y REVIERTE LOS CAMBIOS */
        } catch (\PDOException $e) {
            $res['error'] = true;
            $res['msg']   = 'No se pudo registrar la orden';
            $res['code']  = $e->getCode();
            \Conexion::rollBack();
        }
        return $res;
    }

    public function editar()
    {
        // Validar sesión
        $not_session = \Utils::validate_session();
        if ($not_session) {
            return $not_session;
        }
        $res['error'] = true;
        $orden = new Orden;

        try {
            if (empty($_POST['id']) || empty($_POST['nombre'])
            || empty($_POST['lugar']) || empty($_POST['montaje'])
            || empty($_POST['garantia'])) {
                throw new \Exception('Debe llenar los campos obligatorios');
            }
            $valido = $orden->validaUsuarioEvento($_POST['id_evento']);

            if (!$valido && $_SESSION['usuario']['rol'] != 'Administrador') {
                throw new \Exception('No tiene permiso de editar este evento');
            }

            /** VALIDA LOS CAMPOS EXTRA */
            if (isset($_POST['tag'])) {
                $tag     = $_POST['tag'];
                $content = $_POST['content'];

                for ($i = 0; $i < sizeof($tag); $i++) {
                    if (empty($tag[$i]) || empty($content[$i])) {
                        throw new \Exception('No puede enviar campos extra vacios');
                    }
                }
            }
        } catch (\Exception $e) {
            $res['error'] = true;
            $res['msg']   = $e->getMessage();
            return $res;
        }

        /** MODIFICA LA ORDEN EN LA DB */
        try {
            $orden->modificarOrden($_POST['id']);

        if (isset($_POST['id_campo']) && isset($_POST['tag'])) {
            $id_campo = $_POST['id_campo'];
            $tag      = $_POST['tag'];
            $content  = $_POST['content'];

            for ($i = 0; $i < sizeof($id_campo); $i++) {
                $orden->editarCampoExtra($id_campo[$i], $tag[$i], $content[$i]);
            }
        }
        $res['error'] = false;

        } catch (\PDOException $e) {
            $res['error'] = true;
            $res['msg']   = 'No se pudo registrar la orden';
            $res['code']  = $e->getCode();
        }
        return $res;
    }

    public function delete()
    {
        // Validar sesión
        $not_session = \Utils::validate_session();
        if ($not_session) {
            return $not_session;
        }

        try {
            if (empty($_POST['id'])) {
                throw new \Exception("No se recibió la información");
            }
            $orden = new Orden;

            $valido = $orden->validaUsuarioEvento($_POST['id_evento']);

            if (!$valido && $_SESSION['usuario']['rol'] != 'Administrador') {
                throw new \Exception('No tiene permiso de editar esta orden');
            }

        } catch (\Exception $e) {
            $res['error'] = true;
            $res['msg']   = $e->getMessage();
            return $res;
        }

        try {
            $orden->eliminarOrden($_POST['id'], $_POST['id_evento']);
            $res['error'] = false;

        } catch (\PDOException $e) {
            $res['error'] = true;
            $res['msg']   = 'No se pudo eliminar la orden';
            $res['log']   = $e->getMessage();
        }
        return $res;
    }

    public function printOne($id)
    {
        \Utils::isUser();

        /**--------- OBJETOS --------*/
        setlocale(LC_ALL, 'es_MX.utf8');
        $html      = new \Smarty();
        $html2pdf  = new Html2Pdf('L', 'A4', 'es', 'true', 'UTF-8', [3, 8, 3, 8]);
        $orden     = new Orden;
        $orden  = $orden->find($id['id']);
        $logistica = new Logistica();
        $html2pdf->pdf->SetTitle('Orden de servicio');

        /**----------- VARIABLES -------------*/
        $data_orden = $orden->showWithEvent();
        $id_evento   = $data_orden->id_evento;
        $fecha_hora  = explode(' ', $data_orden->fecha);
        $formato     = $data_orden->tipo_formato;
        $campos_dinamicos = $orden->getExtraInputs(['id_orden' => $id['id']]);

        // Obtener logística
        $actividades = $logistica->getByEvent(['id_evento' => $id_evento]);

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
        // Validar sesión
        $not_session = \Utils::validate_session();
        if ($not_session) {
            return $not_session;
        }
        $orden_id     = $_POST['orden_id'];
        $res['error'] = true;

        if ($orden_id) {
            $orden     = new Orden;
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