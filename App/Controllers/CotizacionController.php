<?php

namespace App\Controllers;

use App\Models\CotizacionModel;
use App\Models\TipoEvento;
use Spipu\Html2Pdf\Html2Pdf;

class CotizacionController {
    
    public function index() {
        \Utils::isVentas();
        return view('cotizacion');
    }

    public function detalle($id) {
        \Utils::isVentas();
            
        if (!empty($id)) {
            $folio = ['folio' => $id['id']];

        } else {
            $folio = [];
        }
        return view('cargar-cotizacion', $folio);
    }

    public function getDetalle($param) {
        \Utils::isVentas();
        $folio = $param['id'];
        $res['error'] = false;
        $cot = new CotizacionModel;
        $cot_id = $cot->getCotId($folio);
        $res['cotizacion'] = $cot->getCotizacion($folio, $_SESSION['usuario']['id_usuario']);
        $res['detalle'] = $cot->getDetalleCot($cot_id);
        $res['total'] = $cot->getTotalCot($folio);
        return json_response($res);
    }

    public function printOne($params) {
        \Utils::isUser();
        
        /** Motor de plantillas */
        $html = new \Smarty();
        $c = new CotizacionModel;
        $folio = isset($params['id']) ? $params['id'] : '';

        /**----------- FORMATO DE LA HOJA ----------------*/
        setlocale(LC_ALL, 'es_MX.utf8');
        $pdf = new Html2Pdf('P', '', 'es', 'true', 'UTF-8');

        $pdf->pdf->SetFont('English111VivaceBT', 'regular', 'english111vivacebt.php');
        $pdf->pdf->SetFont('caslon540btroman_9508', 'regular', 'caslon540btroman_9508.php');
        $pdf->pdf->SetTitle('Cotización');

        /**---------- VERIFICA LOS DATOS POR GET ------------*/
        if (empty($folio) || !isset($_SESSION['usuario'])) {
            echo '<!DOCTYPE html>
            <html lang="es">
            <head>
            <meta charset="UTF-8">
            <title>Cotizacion</title>
            </head><body>No se encontró el archivo</body>
            </html>';
            die();
        }

        /**---------- OBTIENE LOS DATOS DE LA COTIZACION --------*/
        $cotizacion = $c->getCotizacion($folio, $_SESSION['usuario']['id_usuario']);

        if (count($cotizacion) < 1) {
        $pdf->writeHTML('<h1>No tienes acceso a esta información</h1>');
        $pdf->output('Cotizacion_'. date('d-m-Y') .'.pdf');
        die();
        }

        $detalle = $c->getDetalleCot($cotizacion[0]['id']);
        $usuario = $c->getUsuario($cotizacion[0]['usuario_id']);

        if (count($cotizacion) > 0) {
        $cotizacion = $cotizacion[0];
        }

        /**-------------- VARIABLES PHP ----------------*/
        $fecha = ucfirst(strftime('%A %d', strtotime($cotizacion['fecha']))). ' de ' .ucfirst(strftime('%B del %Y', strtotime($cotizacion['fecha'])));

        /**-------------- VARIABLES SMARTY -------------*/
        $html->assign('folio', $folio);
        $html->assign('fecha', $fecha);
        $html->assign('cotizacion', $cotizacion);
        $html->assign('detalle', $detalle);
        $html->assign('usuario', isset($usuario['nombre']) ? strtoupper($usuario['nombre']. ' ' . $usuario['apellidos']) : $usuario['username']);

        /**-------------- CARGA LA VISTA EN LA CACHÉ -----------*/
        ob_start();
        $html->display(TEMP_PDF_PATH .'cotizacion.html');
        $html = ob_get_clean();

        /**-------------- PINTA LA VISTA EN EL DOCUMENTO PDF -----------*/
        $pdf->writeHTML($html);
        $pdf->output('Cotizacion_'. date('d-m-Y ') .'.pdf');
    }

    public function getAll() {
        $c = new CotizacionModel;
        $cotizaciones = $c->getAll($_POST['evento_id']);

        if (count($cotizaciones) > 0) {
            $res['data']  = $cotizaciones;
            $res['error'] = false;

        } else {
            $res['msg']   = 'No hay cotizaciones';
            $res['error'] = true;
        }
        return json_response($res);
    }

    public function getAllByEvent($event) {
        $res['error'] = false;
        $c = new CotizacionModel;
        $res['data'] = $c->getAll($event);
        return json_response($res);
    }

    public function insertar() {
        // Validar sesión
        $not_session = \Utils::validate_session();
        if ($not_session) {
            return $not_session;
        }

        try {
            // VALIDA LOS DATOS POST
            if (empty($_POST['nombre']) || empty($_POST['apellido']) || empty($_POST['email'])) {
               throw new \Exception('Hay campos vacios');
            }

            $c = new CotizacionModel;
   
        } catch (\Exception $e) {
            $res['msg']   = "Error al registrar el cliente";
            $res['log']   = $e->getMessage();
            $res['error'] = true;
            return $res;
        }
        
        try {
            // VALIDA SI EXISTE EL CORREO
            $is_email = $c->isEmail($_POST['email']);
            \Conexion::beginTransaction();
            
            if ($is_email) {
                // SI EXISTE EL CORREO VALIDA SI ES EL PROPIETARIO
                $is_cliente = $c->isCliente($_POST['nombre'], $_POST['apellido'], $_POST['email']);
                
                // SI NO ES EL PROPIETARIO DEL CORREO TIRA UN ERROR
                if (!$is_cliente) {
                    $res['error'] = true;
                    $res['msg'] = 'Ya hay otro cliente con ese correo';
                    \Conexion::rollBack();
                    return $res;
                }
                // OBTIENE EL ID DEL CLIENTE
                $cliente_id = $c->getClienteId($_POST['email']);
                
            } else {
                // SI NO EXISTE EL CORREO EN LA DB INSERTA EL CLIENTE
                $c->insertCliente();
                $cliente_id = \Conexion::lastInsertId();
            }

        } catch (\PDOException $th) {
            $res['msg']   = "Error al registrar el cliente";
            $res['log']   = $th->getMessage();
            $res['error'] = true;
            \Conexion::rollBack();
            return json_response($res, 400);
        }   
        // CAPTURA EL USUARIO EN SESSIÓN
        if (isset($_SESSION['usuario']['nombre']) && isset($_SESSION['usuario']['apellido'])) {
            $responsable = $_SESSION['usuario']['nombre']. ' ' .$_SESSION['usuario']['apellido'];

        } else {
            $responsable = $_SESSION['usuario']['username'];
        }
        // CREA UN ARRAY DE EVENTO
        $data_evento = array(
            'title'      => $_POST['title'],
            'evento'     => $_POST['evento'],
            'contacto'   => $_POST['nombre']. ' ' .$_POST['apellido'],
            'cord_resp'  => strtoupper($responsable),
            'start'      => $_POST['start'],
            'end'        => $_POST['end'],
            'id_lugar'   => (int) $_POST['id_lugar'],
            'personas'   => (int) $_POST['personas'],
            'categoria'  => $_POST['categoria'],
            'color'      => '#d7c735',
            'id_usuario' => (int) $_SESSION['usuario']['id_usuario']
        );
        
        try {
            // INSERTA UN EVENTO EN LA DB
            $c->insertEvento($data_evento);
            $evento_id = \Conexion::lastInsertId();

            // INSERTA UNA COTIZACIÓN EN LA DB
            $c->insertCotizacion($evento_id, $cliente_id);
            $cotizacion_id = \Conexion::lastInsertId();

            // FIN DE LA TRANSACCIÓN Y GUARDA LOS CAMBIOS
            $res['error'] = false;
            $res['data']  = $cotizacion_id;
            \Conexion::commit();
        
        } catch (\PDOException $e) {
            $res['msg']   = 'Error en la operación';
            $res['log']   = $e->getMessage();
            $res['error'] = true;
            \Conexion::rollBack();
        }
        return json_response($res);
    }

    public function insertarManual() {
        // Validar sesión
        $not_session = \Utils::validate_session();
        if ($not_session) {
            return $not_session;
        }

        $cot = new CotizacionModel;

        if (!$cot->validaUsuario($_POST['evento_id'], $_SESSION['usuario']['id_usuario'])) {
            $res['error'] = true;
            $res['msg'] = 'No tiene permiso de editar este evento';
            return $res;
        }

        $evento = $cot->getEvento($_POST['evento_id'])[0];

        $evento = array_merge($evento, $_POST, ['usuario_id' => $_SESSION['usuario']['id_usuario']]);
        $cot->cotizacionManual($evento);

        $res['error'] = false;

        if (!empty($_SESSION['error'])) {
            $res['error'] = true;
            $res['msg'] = $_SESSION['error']['msg'];
            unset($_SESSION['error']);
        }
        return json_response($res);
    }

    public function validar() {
        // VALIDA LOS DATOS POST
        if (empty($_POST['nombre']) || empty($_POST['apellido']) || empty($_POST['telefono']) ||
        empty($_POST['email']) || empty($_POST['pax']) ||
        empty($_POST['id_lugar']) || empty($_POST['fecha_inicio']) || empty($_POST['fecha_final']))
        {
            $res['msg']   = 'Debe llenar todos los campos';
            $res['error'] = true;
            return json_response($res);
        }
        
        /**---------- VALIDAR DISPONIBILIDAD */
        $cot = new CotizacionModel;
        $disponible = $cot->verificarEspacio();
    
        /**----------- VERIFICA QUE NO ESTÉ OCUPADO EL LUGAR */
        if (!$disponible || $disponible == false) {
            $res['msg']   = 'El salón está ocupado en la fecha solicitada';
            $res['error'] = true;
            return $res;
        }
    
        $evento = $_POST['tipo_evento'];
        $dia = date('w', strtotime($_POST['fecha_inicio']));
        $mes = date('n', strtotime($_POST['fecha_inicio']));
    
        /**----------- OBTENER PRECIO POR TEMPORADA ALTA O BAJA **/
        $precio = $cot->getPrecioRenta($dia, $mes, $evento, $_POST['id_lugar']);
        $res['msg']   = $precio['msg'];
        $res['data']  = $precio['precio'];
        $res['error'] = false;
    
        if ($precio['error']) {
            $res['error'] = true;
            return json_response($res);
        }
    
        /** SE OBTIENE EL TIPO DE EVENTO REGISTRADO */
        $t  = new TipoEvento;
        $event_reg    = $t->getOne($evento);
        $res['event'] = strtoupper($event_reg[0]['nombre_tevento']);
        $res['error'] = false;
        return json_response($res);
    }

    public function insertarDetalle() {
        // Validar sesión
        $not_session = \Utils::validate_session();
        if ($not_session) {
            return $not_session;
        }

        $res['error'] = true;
        $cot = new CotizacionModel;
        $cotizacion_id = $cot->getCotId($_POST['folio']);
        $insert        = $cot->insertDetalleCotizacion($cotizacion_id);

        if ($insert === true) {
            $res['error'] = false;
        
        } else {
            $res['data']  = null;
            $res['msg']   = $_SESSION['error'];
            $res['error'] = true;
        }
        unset($_SESSION['error']);
        return json_response($res);
    }

    public function borrarDetalle() {
        // Validar sesión
        $not_session = \Utils::validate_session();
        if ($not_session) {
            return $not_session;
        }

        $cot = new CotizacionModel;
        $delete = $cot->deleteDetalleCot($_POST['detalle_id']);

        if ($delete == true) {
        $res['error'] = false;
        $res['msg']   = 'Elemento borrado';

        } else {
        $res['msg'] = 'Nose pudo borrar';
        }
        return json_response($res);
    }

    public function statusUpdate() {
        $cot = new CotizacionModel;
        $res['error'] = true;
        
        if (!($cot->validaUsuario($_POST['evento_id'], $_SESSION['usuario']['id_usuario'])) &&
        $_SESSION['usuario']['rol'] != 'Administrador') {
            $res['msg'] = 'No tiene permiso de cambiar esta cotización';
            return json_response($res, 400);
        }

        if ($_POST['status'] == 'autorizada' && $_SESSION['usuario']['rol'] != 'Administrador') {
            $res['msg'] = 'No tiene permiso de cambiar esta cotización';
            return json_response($res, 400);
        }

        try {
            $cot->cambiarStatus($_POST['folio'], $_POST['status']);
            $res['error'] = false;

        } catch (\PDOException $e) {
            $res['msg'] = 'No se pudo actualizar';
            $res['log'] = $e->getMessage();
        }
        return json_response($res);
    }
}