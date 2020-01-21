<?php

namespace App\Controllers;

use App\Models\Lugar;

class LugaresController {
    
    public function index() {
        \Utils::isUser();
        return view('lugares');
    }

    public function getLugares() {
        $lugar = new Lugar;
        $lugares = $lugar->getAll();
        return json_response($lugares);
    }

    public function agregar() {
        if (empty($_POST['lugar'])) {
            $res['error'] = true;
            $res['msg'] = 'Agregue un título';
            return json_response($res, 400);
        }
        $lugar = new Lugar;

        $validacion = $lugar->validar($_POST['lugar']);

        if (!$validacion) {
            $res['error'] = true;
            $res['msg'] = $_SESSION['error']['msg'];
            unset($_SESSION['error']);
            return json_response($res, 400);
        }

        try {
            $lugar->insert($_POST['lugar']);
            $res['error'] = false;

        } catch (\PDOException $e) {
            $res['msg'] = 'No se pudo agregar';
            $res['error'] = true;
            $res['log'] = $e->getMessage();
        }
        return json_response($res);
    }

    public function eliminar() {
        $lugar = new Lugar;

        try {
            $lugar->delete($_POST['id_lugar']);
            $res['error'] = false;

        } catch (\PDOException $e) {
            $res['msg'] = 'No se pudo eliminar';
            $res['error'] = true;
            $res['log'] = $e->getMessage();
        }
        return json_response($res);
    }
}