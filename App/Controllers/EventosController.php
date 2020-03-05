<?php

namespace App\Controllers;

use stdClass;
use App\Models\Evento;
use App\Helpers\Validator;
use App\Models\EventosSql;
use App\Models\Logistica;

class EventosController extends Controller
{

    public function index() {
        \Utils::isVentas();

        $evento = new Evento;
        $params = [
            'eventos' => $evento->getAll(),
            'view_url' => 'eventos'
        ];
        return view('eventos.eventos', $params);
    }

    public function getEventos() {
        $evento = new Evento;
        $eventos = $evento->getMonth($_GET['start'], $_GET['end']);
        return json_response($eventos);
    }

    /**
     * Agrega un evento
     * 
     * @return boolean
     */
    public function store() {
        $not_session = \Utils::validate_session();
        $auth        = $_SESSION['usuario'];
        $data        = $_POST;
        $data['id_usuario'] = $_SESSION['usuario']['id_usuario'];
        $validator   = new Validator($data);
        $event       = new Evento();
        
        // Validar sesión
        if ($not_session) {
            return $not_session;
        }

        // Validamos los datos POST
        $result = $validator
        ->validate([
            'title'       => 'required',
            'evento'      => 'required',
            'contacto'    => 'required',
            'cord_resp'   => 'required',
            'cord_apoyo'  => 'nullable',
            'description' => 'nullable',
            'lugar'       => 'required',
            'start'       => 'required',
            'end'         => 'required',
            'personas'    => 'required',
            'categoria'   => 'required',
            'folio'       => 'nullable',
            'color'       => 'required',
            'id_usuario'  => 'required'
        ]);

        if ($result['status'] == 422) {
            return json_response($result['data'], 422);
        }

        if (
            $data['color'] != '#d7c735'
            && strtolower($auth['rol']) != 'administrador'
        ) {
            $data['color'] = '#d7c735';
        }

        $data['status'] = 'tentativo';
        unset($data['id']);

        // VALIDAR FECHAS
        $validacion = $event->validarFechas($data['start'], $data['end']);
        if (!$validacion) {
            $errors = new stdClass;
            $errors->start[] = 'No pueden haber fechas vacias';
            $res['message'] = 'Datos incorrectos';
            $res['errors'] = $errors;
            return json_response($res, 422);
        }

		try {
			// AGREGA EL EVENTO EN LA DB
            $event->agregar($data);
            $res['message'] = 'Registrado correctamente';
            return json_response($res, 200);

		} catch (\PDOException $th) {
            $res['errors'] = true;
            $res['message'] = $th->getMessage();
			return json_response($res, 500);
		}
    }

    /**
     * Actualiza un evento
     * 
     * @return boolean
     */
    public function update() {
        $not_session  = \Utils::validate_session();
        $auth         = $_SESSION['usuario'];
        $event        = new Evento();
        $data         = $_POST;
        $res          = [];
        $color        = '';
        $status       = '';
        
        // Validar sesión
        if ($not_session) return $not_session;

        // Autorizar usuario
        $editable = $event->find($data['id']);
        
        if (
            $auth['id_usuario'] != $editable->id_usuario
            && strtolower($auth['rol']) != 'administrador'
        ) {
            return json_response([
                'data' => [
                    'message' => 'No tiene permiso de editar este evento'
                ]
            ], 401);
        }
        
        // Validar datos POST
        $validator = new Validator($data);
        $result = $validator
        ->validate([
            'title'       => 'required',
            'evento'      => 'required',
            'contacto'    => 'required',
            'cord_resp'   => 'required',
            'cord_apoyo'  => 'nullable',
            'description' => 'nullable',
            'lugar'       => 'required',
            'start'       => 'required',
            'end'         => 'required',
            'personas'    => 'required',
            'categoria'   => 'required',
            'folio'       => 'nullable',
            'color'       => 'required',
            'id'          => 'required',
        ]);

        if ($result['status'] == 422) {
            return json_response($result['data'], 422);
        }

        // VALIDAR FECHAS
        $validacion = $event->validarFechas($data['start'], $data['end']);
        if (!$validacion) {
            $errors = new stdClass;
            $errors->start[] = 'No pueden haber fechas vacias';
            $res['message'] = 'Datos incorrectos';
            $res['errors'] = $errors;
            return json_response($res, 422);
        }

        if (
            $data['color'] != '#d7c735'
            && $editable->color == '#d7c735'
            && strtolower($auth['rol']) != 'administrador'
        ) {
            $data['color'] = '#d7c735';
        }

        // Consigue el status
        switch ($data['color']) {
			case '#54b33d':
				$color =  '#54b33d';
				$status = 'cerrado';
				break;
			case '#f98710':
				$color =  '#f98710';
				$status = 'apartado';
				break;
			case '#d7c735':
				$color = '#d7c735';
				$status = 'tentativo';
				break;
        }
        // ACTUALIZA EL COLOR DEPENDIENDO EL LUGAR
        if ($data['color'] == '#54b33d' && $data['lugar'] == 4) {
            $data['color'] = '#E56285';
        }

        if (
            $data['color'] == '#54b33d' &&
            ($data['lugar'] == 11 || $data['lugar'] == 6 || $data['lugar'] == 12
            || $data['lugar'] == 10 || $data['lugar'] == 9 || $data['lugar'] == 7)
        ) {
            $data['color'] = '#a35018';
        }
        $data['status'] = $status;
        
		try {
            // ACTUALIZA EL EVENTO
            $event->modificar($data);
            $res['message'] = 'Actualizado correctamente.';
            return json_response($res);

		} catch (\PDOException $th) {
            $res['message'] = $th->getMessage();
            return json_response($res, 500);
		}
    }

    /**
     * Elimina un evento de la db
     * 
     * @return boolean
     */
    public function delete() {
        $event = new Evento();
        $not_session = \Utils::validate_session();
        
        // Validar sesión
        if ($not_session) {
            return $not_session;
        }
        
        $res['error'] = true;
        
		try {
            $evento_id = $_POST['id'];
            $usuario = $_SESSION['usuario'];

            // VALIDAR PERMISO
            if ($_SESSION['usuario']['rol'] == 'Administrador')
            $permitido = \ApiEventos::permitirCambios($evento_id, $usuario);
            else
            $permitido = false;

			if (!$permitido) {
				throw new \Exception('<h3>Error</h3><br>No tiene permitido borrar este evento');
			}
		} catch (\Exception $e) {
            $res['error'] = true;
            $res['msg'] = $e->getMessage();
			return json_response($res, 401);
		}
		try {
			// ELIMINA EL EVENTO
            $event->eliminarEvento($evento_id);
            $res['error'] = false;
            return json_response($res);
            
		} catch (\PDOException $th) {
            $res['error'] = true;
            $res['msg'] = 'Hubo un error';
    
            if ($th->getCode() === '23000')
                $res['msg'] = '<h3>Error</h3><br>No se puede eliminar porque contiene cotizaciones';
			return json_response($res, 422);
		}
    }

    public function getIngreso() {
        $eve = new EventosSql;
        $res['ingreso'] = $eve->getIngreso($_POST['evento_id']);
        $res['error'] = false;
        return json_response($res);
    }

    public function getLogistica() {
        $logistic = new Logistica;
        $validator = new Validator($_POST);

        $validation = $validator->validate([
            'id' => 'required'
        ]);

        if ($validation['status'] == 422) {
            return json_response($validation['data']);
        }
        $res = $logistic->getByEvent($_POST['id']);
        
        return json_response($res);
    }

    public function getOrders() {
        $event = new Evento();
        $e = $event->find($_POST['id']);
        $res = $e->getOrders();
        return json_response($res);
    }
}