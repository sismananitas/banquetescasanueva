<?php

namespace App\Controllers;

use App\Models\Logistica;

class LogisticaController extends Controller {

    public function getOne($id) {

        $logistica = new Logistica();
        $res = $logistica->getOne($id);
        return json_response($res);
    }

    public function create() {
        // Validar sesión
        $not_session = \Utils::validate_session();
        if ($not_session) {
            return $not_session;
        }

        if (empty($_POST['title'])) {
            $res['msg'] = 'Agregue un título';
            $res['error'] = true;
            return json_response($res);
        }
        $logistica = new Logistica();
    
        $datos = array(
            'id_evento' => $_POST['id_evento'],
            'start'     => $_POST['date_start'].' '.$_POST['time_start'],
            'title'     => $_POST['title'],
            'lugar'     => $_POST['lugar']
        );
      
        try {
            $res = $logistica->agregarLogistica($datos);
            $res['error'] = false;
            return json_response($res);
      
        } catch (\Exception $e) {
            $res['error'] = true;
    
            if ($e->getCode() === 10) {
            $res['msg'] = $e->getMessage();
    
            } else {
            $res['msg'] = 'No se pudo agregar la actividad';
            $res['log'] = $e->getMessage();
            }
            return json_response($res);
        }
    }

    public function editar() {
        // Validar sesión
        $not_session = \Utils::validate_session();
        if ($not_session) {
            return $not_session;
        }

        if (empty($_POST['id']) || empty($_POST['title'])) {
            $res['msg'] = 'Agregue un titulo';
            $res['error'] = true;
            return json_response($res);
        }
        $logistica = new Logistica();
    
        $datos = array(
            'id_evento' => $_POST['id_evento'],
            'start'     => $_POST['date_start'].' '.$_POST['time_start'],
            'title'     => $_POST['title'],
            'lugar'     => $_POST['lugar']
        );
    
        try {
            $res = $logistica->modificarLogistica($_POST['id'], $datos);
            $res['error'] = false;
            return json_response($res);
    
        } catch (\PDOException $e) {
            $res['error'] = true;
            $res['msg'] = $e->getMessage();
            return json_response($res);
        }
    }

    public function delete() {
        // Validar sesión
        $not_session = \Utils::validate_session();
        if ($not_session) {
            return $not_session;
        }
        
        $res['error'] = true;

        if (empty($_POST['id'])) {
            $res['error'] = true;
            $res['msg'] = 'Faltan datos';
        }

        $logistica = new Logistica();
        
        try {
            $logistica->eliminarLogistica($_POST['id'], $_POST['id_evento']);
            $res['error'] = false;
        
        } catch (\PDOException $e) {
            $res['error'] = true;
            $res['msg'] = $e->getMessage();
        }
        return json_response($res);
    }
}