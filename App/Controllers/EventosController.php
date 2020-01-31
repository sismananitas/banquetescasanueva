<?php

namespace App\Controllers;

use App\Models\Evento;
use App\Models\EventosSql;
use App\Models\TablaModel;
use Helpers\Validator;
use stdClass;

class EventosController {

    public function index() {
        \Utils::isVentas();

        $evento = new Evento;
        $params = [
            'eventos' => $evento->getAll()
        ];
        return view('eventos.eventos', $params);
    }

    public function getEventos() {
        $evento = new Evento;
        $eventos = $evento->getMonth($_GET['start'], $_GET['end']);
        return json_response($eventos, 200);
    }

    /**
     * Agrega un evento
     * 
     * @return boolean
     */
    public function agregar() {
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
            return json_response($res);
        }

		try {
			// AGREGA EL EVENTO EN LA DB
            $event->agregarEvento();
            $res['error'] = false;
            return json_response($res);

		} catch (\PDOException $th) {
            $res['error'] = true;
            $res['msg'] = $th->getMessage();
			return json_response($res);
		}
    }

    /**
     * Actualiza un evento
     * 
     * @return boolean
     */
    public function update() {
        // Validar sesión
        $not_session = \Utils::validate_session();
        $data = $_POST;
        $auth = $_SESSION['usuario'];

        if ($not_session) {
            return $not_session;
        }

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

        $event = new Evento();
        $res['error'] = true;
        
		//$usuario = $_SESSION['usuario'];
        
		try {
            // VALIDA LOS DATOS POR POST
            // \ApiEventos::validaDatosAgregar($_POST);
			// VALIDAR PERMISO
			// $permitido = \ApiEventos::permitirCambios($evento_id, $usuario);
			// if (!$permitido) {
			// 	throw new \Exception('<h3>Error</h3><br>No tiene permitido editar este evento');
			// }

			// VALIDAR FECHAS
			$validacion = $event->validarFechas($data['start'], $data['end']);
			if (!$validacion) {
				throw new \Exception('<h3>Datos incorrectos</h3><br>No pueden haber fechas vacias');
            }        
		} catch (\Exception $e) {
            $errors = new stdClass;
            $errors->start[] = $e->getMessage();

            $res['error'] = true;
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
            $res['error'] = false;
            return json_response($res);

		} catch (\PDOException $th) {
			$res['error'] = true;
            $res['msg'] = 'Hubo un error';
            $res['log'] = $th->getMessage();
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
			return json_response($res);
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
			return json_response($res);
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

    public function getOrden() {
        $tabla = new TablaModel('ordenes_servicio');
        $res = $tabla->obtener_datos_donde('id_evento', $_POST['id']);
        return json_response($res);
    }
}