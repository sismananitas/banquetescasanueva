<?php

namespace App\Controllers;

use App\Models\Precio;

class PreciosController extends Controller
{
    public function index() {
        \Utils::isUser();
        return view('precios.precios');
    }

    public function getAll() {
        $precio = new Precio;
        $precios = $precio->getAll();
        return json_response($precios, 200);
    }

    public function insertar() {
        if (empty($_POST['lugar']) || empty($_POST['tipo_evento'])
        || empty($_POST['precio_alta']) || empty($_POST['precio_baja'])) {
            $res['msg'] = 'Debe llenar todos los campos';
            $res['error'] = true;
            return $res;
        }
         
        $data = array(
            'lugar' => $_POST['lugar'],
            'evento' => $_POST['tipo_evento'],
            'precio_alta' => $_POST['precio_alta'],
            'precio_baja' => $_POST['precio_baja']
        );

        $precio = new Precio;
        $validacion = $precio->validar($data);

        if (!$validacion) {
            $res['msg'] = 'Ese precio ya ha sido registrado';
            $res['error'] = true;
            return $res;
        }

        try {
            $precio->insertar($data);
            $res['error'] = false;

        } catch (\PDOException $th) {
            $res['msg'] = 'Error al insertar';
            $res['error'] = true;
            $res['log'] = $th->getMessage();
        }
        return $res;
    }

    public function editar() {
        $data = array(
            'lugar' => $_POST['lugar'],
            'evento' => $_POST['tipo_evento'],
            'precio_alta' => $_POST['precio_alta'],
            'precio_baja' => $_POST['precio_baja']
        );
        $precio = new Precio;

        try {
            $precio->update($data);
            $res['error'] = false;

        } catch (\PDOException $th) {
            $res['msg'] = 'Error al editar';
            $res['error'] = true;
            $res['log'] = $th->getMessage();
        }
        return $res;
    }

    public function borrar() {
        $precio = new Precio;
        if (empty($_POST['id_precio'])) {
            $res['error'] = true;
            $res['msg'] = 'No se recibieron los datos';
            return $res;
        }

        try {
            $precio->delete($_POST['id_precio']);
            $res['error'] = false;

        } catch (\PDOException $th) {
            $res['error'] = true;
            $res['msg'] = 'No se pudo eliminar';
            $res['log'] = $th->getMessage();
        }
        return $res;
    }
}
