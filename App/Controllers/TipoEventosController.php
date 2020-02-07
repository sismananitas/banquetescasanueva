<?php

namespace App\Controllers;

use App\Models\TipoEvento;

class TipoEventosController extends Controller
{    
    public function index() {
        \Utils::isAdmin();
        $tipoEve = new TipoEvento;
        $eventos = $tipoEve->getAll();

        return view('tipo_eventos.tipo_eventos', ['tipo_eventos' => $eventos]);
    }

    public function getAll() {
        $tipoEve = new TipoEvento;
        $eventos = $tipoEve->getAll();
        return json_response($eventos, 200);
    }

    public function insertar() {
        $tipoEve = new TipoEvento;
        
        if (empty($_POST['nombre'])) {
            $res['error'] = true;
            $res['msg'] = 'No pueden haber campos vacios';
            return $res;
        }        

        if (!$tipoEve->validar()) {
            $res['error'] = true;
            $res['msg'] = $_SESSION['error']['msg'];
            unset($_SESSION['error']);
            return $res;
        }

        try {
            $tipoEve->insert($_POST['nombre']);
            $res['success'] = 'Registrado correctamnente';
            return json_response($res);

        } catch (\PDOException $e) {
            $res['error'] = true;
            $res['message'] = $e->getMessage();
            return json_response($res, 500);
        }
    }

    public function eliminar() {
        $tipoEve = new TipoEvento;
        $tipoEve = $tipoEve->find($_POST['id']);

        try {
            $tipoEve->delete();
            $res['success'] = 'Eliminado correctamente';
            return json_response($res);

        } catch (\PDOException $e) {
            $res['error'] = true;
            $res['message'] = $e->getMessage();
            return json_response($res, 500);
        }
    }
}