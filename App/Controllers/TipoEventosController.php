<?php

namespace App\Controllers;

use App\Models\TipoEvento;

class TipoEventosController extends Controller
{    
    public function index() {
        \Utils::isAdmin();
        $tipoEve = new TipoEvento;
        $eventos = $tipoEve->getAll();

        return view('tipo_eventos', ['tipo_eventos' => $eventos]);
    }

    public function getAll() {
        $tipoEve = new TipoEvento;
        $eventos = $tipoEve->getAll();
        return json_response($eventos, 200);
    }

    public function insertar() {
        if (empty($_POST['nombre'])) {
            $res['error'] = true;
            $res['msg'] = 'No pueden haber campos vacios';
            return $res;
        }
        
        $tipoEve = new TipoEvento;
        $tipoEve->setNombre($_POST['nombre']);

        if (!$tipoEve->validar()) {
            $res['error'] = true;
            $res['msg'] = $_SESSION['error']['msg'];
            unset($_SESSION['error']);
            return $res;
        }

        try {
            $tipoEve->insert();
            $res['error'] = false;

        } catch (\PDOException $e) {
            $res['error'] = true;
            $res['msg'] = 'Ocurrio un error';
            $res['log'] = $e->getMessage();
        }
        return $res;
    }

    public function eliminar() {
        $tipoEve = new TipoEvento;
        $tipoEve->setId($_POST['id']);

        try {
            $tipoEve->delete();
            $res['error'] = false;

        } catch (\PDOException $e) {
            $res['error'] = true;
            $res['msg'] = 'No se pudo eliminar';
            $res['log'] = $e->getMessage();
        }
        return $res;
    }
}