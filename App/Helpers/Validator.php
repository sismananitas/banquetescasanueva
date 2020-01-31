<?php

namespace Helpers;

use stdClass;

class Validator {

    private $req;
    // private $definitions;

    public function __construct($request = [])
    {
        $this->req = $request;
        // $this->definitions = [
        // ];
    }

    /**
     * Valida un request y devuelve los errores en el formato de laravel
     */
    public function validate($constraints, $new_data = null)
    {
        $data = $this->req;
        $results = new stdClass;
        $errors = false;

        $validated = $this->validateConstrains($constraints);
        if ($validated->invalid) {
            $field = $validated->field;
            $results->$field[] = $validated->message;
            $errors = true;
        }

        if ($new_data) $data = $new_data;
        
        foreach ($data as $field_name => $field_value) { // Recorre indices de los datos
            
            if (array_key_exists($field_name, $constraints)) { // Valida que existan reglas para el indice
                $rules = explode('|', $constraints[$field_name]); // Obtiene las reglas como array dividar por pipas

                $field_validated = $this->apliRules($field_name, $field_value, $rules);
                
                if ($field_validated->invalid) {
                    $results->$field_name[] = $field_validated->message;
                    $errors = true;
                }
            }
        }

        if ($errors) {
            return [
                'status' => 422,
                'data' => [
                    'message' => 'Error en los datos.',
                    'errors' => $results,
                ]
            ];
        }
        else {
            return [
                'status' => 200,
                'data' => [
                    'message' => 'Validado correctamente',
                    'errors' => [],
                ]
            ];
        }
    }

    /**
     * Valida un campo especifico
     * @param string $param campo a validar
     * @param array $rules reglas a aplicar
     */
    private function apliRules($param_name, $param_value, $rules)
    {
        $respose = new stdClass;
        $respose->invalid = false;
        
        foreach ($rules as $rule) {
            if ($rule == 'required' && empty($param_value)) {
                $respose->message = 'El campo '. $param_name . ' no puede ir vacío.';
                $respose->invalid = true;
            }
            if ($rule == 'numeric' && !is_numeric($param_value)) {
                $respose->message = 'El campo '. $param_name . ' debe ser un número.';
                $respose->invalid = true;
            }
            if ($rule == 'string' && !is_string($param_value)) {
                $respose->message = 'El campo '. $param_name . ' deben ser caracteres.';
                $respose->invalid = true;
            }
            if ($rule == 'email' && (empty($param_value) && !in_array('nullable', $rules)) && !filter_var($param_value, FILTER_VALIDATE_EMAIL)) {
                $respose->message = 'El campo '. $param_name . ' deben ser un correo válido.';
                $respose->invalid = true;
            }
        }
        return $respose;
    }

    public function all()
    {
        return $this->req;
    }

    private function validateConstrains($constrains)
    {
        $respose = new stdClass;
        $respose->invalid = false;

        foreach ($constrains as $key => $value) {
            if (!array_key_exists($key, $this->req)) {
                $respose->message = 'El campo '. $key . ' no puede ir vacío.';
                $respose->field = $key;
                $respose->invalid = true;
            }
        }
        return $respose;
    }
}