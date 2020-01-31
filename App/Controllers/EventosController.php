<?php

namespace App\Controllers;

use stdClass;
use Helpers\Validator;
use App\Models\Evento;
use App\Models\EventosSql;
use App\Models\TablaModel;

class EventosController {

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
        // Validar sesión
        $not_session = \Utils::validate_session();
        
        if ($not_session) {
            return $not_session;
        }

        $event = new Evento();
        $res['error'] = true;
        try {
            // VALIDA LOS DATOS POR POST
            \ApiEventos::validaDatosAgregar($_POST);
            
            // VALIDAR FECHAS
            $validaFormato = $event->validarFechas($_POST['start'], $_POST['end']);
            if (!$validaFormato) {
                throw new \Exeption('<h3>Datos incorrectos</h3><br>No pueden haber fechas vacias');
            }
            $validaFecha = \ApiEventos::fechaDisponible($_POST);

            if (!$validaFecha) {
                throw new \Exception('El salón se encuentra ocupado en esa fecha');
            }

        } catch (\Exception $e) {
            $res['error'] = true;
            $res['msg'] = $e->getMessage();
            return json_response($res, 422);
        }

		try {
			// AGREGA EL EVENTO EN LA DB
            $event->agregarEvento();
            $res['error'] = false;
            return json_response($res);

		} catch (\PDOException $th) {
            $res['error'] = true;
            $res['msg'] = $th->getMessage();
			return json_response($res, 500);
		}
    }

    /**
     * Actualiza un evento
     * 
     * @return boolean
     */
    public function update() {
        // Validar sesión
        $not_session  = \Utils::validate_session();
        $auth         = $_SESSION['usuario'];
        $event        = new Evento();
        $data         = $_POST;
        $res['data']  = [];
        $color        = '';
        $status       = '';

        $editable = $event->find(['id' => $data['id']]);
        if ($not_session) return $not_session;

        // Autorizar usuario
        if (
            $auth['id_usuario'] != $editable->id_usuario
            || strtolower($auth['rol']) != 'administrador'
        ) {
            return json_response([
                'data' => [
                    'message' => 'No tiene permiso de editar este evento'
                ]
            ], 401);
        }

        if (
            $data['color'] != '#d7c735'
            && $editable['color'] == '#d7c735'
            && $auth['rol'] != 'Administrador'
        ) {
            $data['color'] = '#d7c735';
        }

        // Consigue el status
        switch ($_POST['color']) {
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
        $data['status'] = $status;

        // Valido los datos
        $validator = new Validator($data);
        $result = $validator
        ->validate([
            'title' => 'required',
            'evento' => 'required',
            'contacto' => 'required',
            'cord_resp' => 'required',
            'cord_apoyo' => 'nullable',
            'description' => 'nullable',
            'id_lugar' => 'required',
            'start' => 'required',
            'end' => 'required',
            'personas' => 'required',
            'categoria' => 'required',
            'folio' => 'nullable',
            'status' => 'required',
            'color' => 'required',
            'id' => 'required',
        ]);

        if ($result['status'] == 422) {
            return json_response($result, 422);
        }
        
		try {
			// VALIDAR FECHAS
			$validacion = $event->validarFechas($data['start'], $data['end']);
			if (!$validacion) {
				throw new \Exception('<h3>Datos incorrectos</h3><br>No pueden haber fechas vacias');
            }        
		} catch (\Exception $e) {
            $errors = new stdClass;
            $errors->start[] = $e->getMessage();

            $res['status'] = 422;
            $res['data'] = [
                'message' => $e->getMessage(),
                'errors' => $errors
            ];
            return json_response($res, 422);
		}
		try {
            // ACTUALIZA EL EVENTO
            $event->modificarEvento($data);
            $res['data'] = ['message' => 'Actualizado correctamente.'];
            return json_response($res);

		} catch (\PDOException $th) {
            $res['status'] = 422;
            $res['data'] = ['message' => $th->getMessage()];
            return json_response($res, 500);
		}
    }

    /**
     * Elimina un evento de la db
     * 
     * @return boolean
     */
    public function delete() {
        // Validar sesión
        $not_session = \Utils::validate_session();
        
        if ($not_session) {
            return $not_session;
        }
        
        $event = new Evento();
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
        $tabla = new TablaModel('sub_evento');

        if (empty($_POST['id'])) {   
            echo 0;
            die();
        }
        $res = $tabla->obtener_datos_donde('id_evento', $_POST['id']);
        return json_response($res);
    }
}