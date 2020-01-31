<?php

class ApiEventos {

    public static function validaDatosAgregar($post) {
        if (empty($post['title']) || empty($post['evento']) ||
            empty($post['contacto']) || empty($post['personas'])) {
            throw new \Exception('<h3>Datos incorrectos</h3><br>Debe llenar los campos obligatorios (*)');
        }
        if (!is_numeric($post['personas'])) {
            throw new \Exception('<h3>Datos incorrectos</h3><br>El campo personas debe ser de tipo numérico');
        }
    }

    public static function fechaDisponible($post) {
        $data = array(
            'inicio' => $post['start'],
            'final' => $post['end'],
            'color' => '#d7c735',
            'id_lugar' => $post['id_lugar']
        );
        $validacion = true;
        /**
         * CHECA SI HAY EVENTOS QUE ATRAVIEZAN LAS FECHAS INICIO O FINAL
         */
        $sql = "SELECT title FROM eventos
        WHERE ((:inicio BETWEEN start and end)
        OR (:final BETWEEN start and end))
        AND (id_lugar = :id_lugar AND color != :color)";

        $is_event = \Conexion::query($sql, $data, true);

        if (count($is_event) > 0) {
            $validacion = false;

        } else {
            /**
             * CHECA SI HAY EVENTOS QUE EMPIECEN O TERMINEN ENTRE DE LAS FECHAS INICIO O FINAL
             */
            $sql = "SELECT title FROM eventos
            WHERE ((start between :inicio and :final)
            OR (end between :inicio and :final))
            AND (id_lugar = :id_lugar AND color != :color)";

            $is_event = \Conexion::query($sql, $data, true);
            
            if (count($is_event) > 0) {
                $validacion = false;
            }
        }
        return $validacion;
    }

    public static function permitirCambios($evento_id, $usuario) {
        $usuario_id = $usuario['id_usuario'];
        $rol = $usuario['rol'];
        $validacion = false;

        $sql = "SELECT id_evento FROM eventos WHERE id_evento = ? AND id_usuario = ?";

        $events = \Conexion::query($sql, [$evento_id, $usuario_id], true);
        $result = count($events);

        if ($result == 1) {
            $validacion = true;
        }
        if ($rol == 'Administrador' || $rol == 'Supervisor') {
            $validacion = true;
        }
        return $validacion;
    }

    public static function getCotizacion($evento_id) {

        $sql = "SELECT c.id FROM cotizaciones WHERE evento_id = ?";

        $result = \Conexion::query($sql, [$evento_id], true);

        if (!$result) {
            throw new \Exception('No tiene cotización');
        }
    }
}