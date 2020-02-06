<?php

namespace App\Controllers;

use App\Helpers\Validator;
use App\Models\Evento;
use App\Models\Logistica;

class LogisticaController extends Controller
{
    public function getOne($id)
    {
        $logistica = new Logistica();
        $res = $logistica->getOne($id);
        return json_response($res);
    }

    public function store()
    {
        $auth  = $_SESSION['usuario'];
        $logistica = new Logistica();
        $validator = new Validator($_POST);
        $event = new Evento();
        $event = $event->find($_POST['id_evento']);
        $not_in_session = \Utils::validate_session();

        // Validar sesión
        if ($not_in_session) {
            return $not_in_session;
        }

        // Valida los datos POST
        $validate_result = $validator->validate([
            'title' => 'required',
            'lugar' => 'required',
            'date_start' => 'required'
        ]);

        if ($validate_result['status'] == 422) {
            return json_response($validate_result['data'], 422);
        }

        // Valida el autor del evento
        if ($event->id_usuario != $auth['id_usuario'] && $auth['rol'] != 'Administrador') {
            return json_response([
                'message' => 'No tienes permiso de editar este evento',
                'errors' => ''
            ], 422);
        }
    
        $datos = [
            'id_evento' => $_POST['id_evento'],
            'start'     => $_POST['date_start'].' '.$_POST['time_start'],
            'title'     => $_POST['title'],
            'lugar'     => $_POST['lugar']
        ];
      
        try {
            $logistica->agregarLogistica($datos);
            $res['success'] = 'Registrado correctamente';
            return json_response($res);
      
        } catch (\Exception $e) {
            $res['message'] = 'No se pudo agregar la actividad';
            $res['error'] = ['system' => $e->getMessage()];
            return json_response($res, 500);
        }
    }

    public function update()
    {
        $auth  = $_SESSION['usuario'];
        $logistica = new Logistica();
        $validator = new Validator($_POST);
        $event = new Evento();
        $event = $event->find($_POST['id_evento']);
        $not_in_session = \Utils::validate_session();

        // Validar sesión
        if ($not_in_session) {
            return $not_in_session;
        }

        // Valida el autor del evento
        if ($event->id_usuario != $auth['id_usuario'] && $auth['rol'] != 'Administrador') {
            return json_response([
                'message' => 'No tienes permiso de editar este evento',
                'errors' => ''
            ], 401);
        }

        // Valida los datos POST
        $validate_result = $validator->validate([
            'title' => 'required',
            'lugar' => 'required',
            'date_start' => 'required'
        ]);

        if ($validate_result['status'] == 422) {
            return json_response($validate_result['data'], 422);
        }
    
        $datos = [
            'id'        => $_POST['id'],
            'id_evento' => $_POST['id_evento'],
            'start'     => $_POST['date_start'].' '.$_POST['time_start'],
            'title'     => $_POST['title'],
            'lugar'     => $_POST['lugar']
        ];
    
        try {
            $res = $logistica->modificarLogistica($datos);
            $res['success'] = 'Actualizado correctamente';
            return json_response($res);
    
        } catch (\PDOException $e) {
            $res['errors'] = true;
            $res['message'] = $e->getMessage();
            return json_response($res, 500);
        }
    }

    public function destroy()
    {
        $auth  = $_SESSION['usuario'];
        $logistica = new Logistica();
        $validator = new Validator($_POST);
        $event = new Evento();
        $event = $event->find($_POST['id_evento']);
        $not_session = \Utils::validate_session();
        
        // Validar sesión
        if ($not_session) {
            return $not_session;
        }

        // Valida los datos POST
        $validate_result = $validator->validate([
            'id' => 'required',
        ]);

        if ($validate_result['status'] == 422) {
            return json_response($validate_result['data'], 422);
        }

        // Valida el autor del evento
        if ($event->id_usuario != $auth['id_usuario'] && $auth['rol'] != 'Administrador') {
            return json_response([
                'message' => 'No tienes permiso de editar este evento',
                'errors' => ''
            ], 401);
        }
        
        try {
            $logistica->eliminarLogistica($_POST['id'], $_POST['id_evento']);
            $res['success'] = 'Eliminado correctamente';
            return json_response($res, 200);
        
        } catch (\PDOException $e) {
            $res['error'] = true;
            $res['message'] = $e->getMessage();
            return json_response($res, 500);
        }
    }
}