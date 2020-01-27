<?php

namespace App\Models;

class CotizacionModel extends Model
{
    public function __construct()
    {
        parent::__construct();
        $this->table = 'cotizaciones';
        $this->primaryKey = 'folio';
    }

    /**
     * OBTENER TODAS LA COTIZACIONES
     */
    public function getAll($evento_id)
    {
        $sql = "SELECT co.folio, CONCAT(cl.nombre, ' ', cl.apellido) as 'cliente', CONCAT(u.username) as 'usuario',
        co.fecha, co.renta, co.personas, co.estado, co.renta + SUM(d.subtotal) as 'total' 
        FROM cotizaciones co INNER JOIN clientes cl ON co.cliente_id = cl.id
        INNER JOIN usuarios u ON co.usuario_id = u.id_usuario
        LEFT JOIN detalle_cotizacion d ON co.id = d.cotizacion_id
        WHERE co.evento_id = :evento_id
        GROUP BY co.id;";

        $select = \Conexion::query($sql, $evento_id, true);
        return $select;
    }

    public function getByEvent($evento_id) {
        $sql = "SELECT * FROM cotizaciones WHERE evento_id = :evento_id";
        return \Conexion::query($sql, $evento_id, true);
    }
    
    /**
     * FUNCIONES PRIVADAS
     */
    private function getArrayDisponib() {
        return array(
            'inicio'   => $_POST['fecha_inicio'] .' '. $_POST['tiempo_inicio'],
            'final'    => $_POST['fecha_final'] .' '. $_POST['tiempo_final'],
            'id_lugar' => intval($_POST['id_lugar']),
            'color'    => '#d7c735'
        );
    }
    
    private function getArrayCot() {
        $evento_id = isset($_POST['evento_id']) ? $_POST['evento_id'] : '';
        $folio = $this->createFolio();
        return array(
            'evento_id'   => $evento_id,
            'cliente_id'  => isset($_POST['cliente_id']) ? $_POST['cliente_id'] : '',
            'usuario_id'  => (int) $_SESSION['usuario']['id_usuario'],
            'folio'       => $folio,
            'renta'       => $_POST['renta'],
            'pax'         => abs($_POST['pax']),
            'estado'      => 'pendiente',
            'costo_total' => $_POST['renta']
        );
    }

    private function getArrayDetalleCot() {
        $array = array();
        $count = count($_POST['descripcion']);

        foreach ($_POST['descripcion'] as $d) {
            if (empty($d)) { return null; }
        }

        for ($i = 0; $i < $count; $i++) {
            $descripcion = $_POST['descripcion'][$i];
            $cantidad    = isset($_POST['cantidad'][$i]) ? (int) $_POST['cantidad'][$i] : 0;
            $precio      = isset($_POST['precio'][$i]) ? (float) $_POST['precio'][$i] : 0;
            $subtotal    = $cantidad * $precio;
            array_push($array, array(
                'descripcion'     => $descripcion,
                'precio_unitario' => $precio,
                'cantidad'        => $cantidad,
                'servicio'        => 0,
                'iva'             => 0,
                'subtotal'        => $subtotal
            ));
        }
        return $array;
    }

    public function getArrayCliente() {
        return array(
            'nombre'   => strtoupper($_POST['nombre']),
            'apellido' => strtoupper($_POST['apellido']),
            'email'    => $_POST['email'],
            'telefono' => $_POST['telefono']
        );
    }

    /**
     * VALIDAR DISPONOBILIDAD
     */
    public function verificarEspacio() {
        $data       = $this->getArrayDisponib();
        $validacion = true;
        /**
         * CHECA SI HAY EVENTOS QUE ATRAVIEZAN LAS FECHAS INICIO O FINAL
         */
        $sql = "SELECT title FROM eventos WHERE ((:inicio BETWEEN start and end) OR
        (:final BETWEEN start and end)) AND
        (id_lugar = :id_lugar AND color != :color)";

        $is_event = \Conexion::query($sql, $data, true);

        if (count($is_event) > 0) {
            $validacion = false;

        } else {
            /**
             * CHECA SI HAY EVENTOS QUE EMPIECEN O TERMINEN ENTRE DE LAS FECHAS INICIO O FINAL
             */
            $sql = "SELECT title FROM eventos WHERE ((start between :inicio and :final) OR 
            (end between :inicio and :final)) AND
            (id_lugar = :id_lugar AND color != :color)";

            $is_event = \Conexion::query($sql, $data, true);
            
            if (count($is_event) > 0) {
                $validacion = false;
            }
        }
        return $validacion;
    }

    /**
     * INSERTAR COTIZACIÓN
     */
    public function insertCotizacion($evento_id, $cliente_id) {
        $data               = $this->getArrayCot();
        $data['evento_id']  = $evento_id;
        $data['cliente_id'] = $cliente_id;
        $validacion         = $this->validaFolioCot($data['folio']);
        // SI PASA LA VALIDACIÓN INSERTA LA COTIZACIÓN
        if ($validacion) {
            $sql = "INSERT INTO cotizaciones VALUES
            (null, :evento_id, :cliente_id, :usuario_id, :folio, CURDATE(), :renta, :pax, :estado, :costo_total)";
            
            \Conexion::query($sql, $data);

        } else {
           throw new \Exception('No tiene permiso de crear esta cotización');
        }
    }

    /**
     * INSERTAR CLIENTE
     */
    public function insertCliente() {
        $d = $this->getArrayCliente();
        
        $sql = "INSERT INTO clientes VALUES
        (null, :nombre, :apellido, :email, :telefono, CURRENT_DATE())";
        
        \Conexion::query($sql, $d);
    }

    /**
     * INSERT EVENTO
     */
    public function insertEvento($data) {
        $sql = "INSERT INTO eventos VALUES
        (null, :title, :evento, null, :contacto, :cord_resp, null, null, :id_lugar, :start, :end, :personas, :categoria, :color, :id_usuario)";

        \Conexion::query($sql, $data);
    }

    /**
     * INSERT DETALLE COTIZACIÓN
     */
    public function insertDetalleCotizacion($cotizacion_id) {
        $data = $this->getArrayDetalleCot();
        $v    = $this->varlidaCotizacion($cotizacion_id);

        if (!$v) {
            $_SESSION['error'] = 'No tiene permiso de editar esta cotización';
            return false;
        }

        if ($data == null) { 
            $_SESSION['error'] = 'No pueden ir campos vacios';
            return false;
        }

        $sql = "INSERT INTO detalle_cotizacion VALUES
        (null, :cotizacion_id, :descripcion, :precio_unitario, :cantidad, :servicio, :iva, :subtotal)";

        foreach ($data as $detalle) {
            $detalle['cotizacion_id'] = $cotizacion_id;

            try {
                $insert = \Conexion::query($sql, $detalle);

            } catch (\PDOException $e) {
                if ($insert->errorCode() !== 0) {
                    $_SESSION['error'] = "Syntax Error: ". $e->getMessage();
                    return false;
                }
            }
        }
        return true;
    }

    /**
     * OBTENER PRECIO RENTA
     */
    public function getPrecioRenta($dia, $mes, $id_tevento, $id_lugar) {
        $precio        = 0;
        $precio_result = array(
            'msg'      => '',
            'precio'   => 0,
            'error'    => false
        );

        $sql = "SELECT id_precio, precio_alta, precio_baja FROM precios_renta
        WHERE id_tipo_evento = :id_tevento AND id_lugar = :id_lugar";

        $is_precio = \Conexion::query($sql, array('id_tevento' => $id_tevento, 'id_lugar' => $id_lugar), true);

        if (count($is_precio) < 1) {
            $precio_result['msg']   = 'No se ha registrado un precio del salón para ese tipo de evento';
            $precio_result['error'] = true;
            return $precio_result;

        } else {
            /** OBTIENE EL PRECIO EN LA POSICION 0 */
            $precio_result['msg'] = 'El salon esta libre.<br/><br/>Precio ';
            $precio               = $is_precio[0];
        }

        if ($dia === '6' && ($mes === '2' || $mes === '3' || $mes === '4' ||
            $mes === '5' || $mes === '10' || $mes === '11')) {

            $precio_result['msg']   .= '(temporada alta)<br/><br>$ '. $precio['precio_alta'];
            $precio_result['precio'] = $precio['precio_alta'];

        } else {
            $precio_result['msg']   .= '(temporada baja)<br/><br>$ '. $precio['precio_baja'];
            $precio_result['precio'] = $precio['precio_baja'];
        }
        return $precio_result;
    }

    /**
     * OBTENER DATA CLIENTE
     */
    public function getCliente($cliente_id) {
        $sql = "SELECT nombre, apellido FROM clientes WHERE id = :cliente_id";

        $cliente = \Conexion::query($sql, array('cliente_id' => $cliente_id), true, true);
        return $cliente;
    }

    /**
     * OBTENER CLIENTE ID
     */
    public function getClienteId($email)
    {
        $sql = "SELECT id FROM clientes WHERE email = :email";

        $cliente_id = \Conexion::query($sql, array('email' => $email), true, true);
        return $cliente_id['id'];
    }

    /**
     * OBTENER USUARIO
     */
    public function getUsuario($usuario_id)
    {
        $sql = "SELECT nombre, apellidos FROM usuarios u
        INNER JOIN detalle_usuario d ON d.id_usuario = u.id_usuario
        WHERE u.id_usuario = :usuario_id";

        $usuario = \Conexion::query($sql, array('usuario_id' => $usuario_id), true, true);
        return $usuario;
    }

    /**
     * OBTENER EVENTO
     */
    public function getEvento($evento_id) {
        $sql = "SELECT title, evento, personas, categoria, id_lugar,
        DATE_FORMAT(start, '%d') as dia, DATE_FORMAT(start, '%m') as mes
        FROM eventos
        WHERE id_evento = :evento_id";

        $evento = \Conexion::query($sql, array('evento_id' => $evento_id), true);
        return $evento;
    }

    /**
     * OBTENER TIPO EVENTO
     */
    public function getTipoEvento($evento_id) {
        $sql = "SELECT te.id_tipo_evento
        FROM tipo_eventos te INNER JOIN
        eventos e ON e.evento = te.nombre_tevento
        WHERE e.id_evento = :evento_id";

        $evento = \Conexion::query($sql, array('evento_id' => $evento_id), true);
        return $evento;
    }

    /**
     * OBTENER COTIZACIÓN
     */
    public function getCotizacion($cotizacion_folio, $usuario_id) {
        if ($_SESSION['usuario']['rol'] == 'Administrador') {
            $data = array('folio' => $cotizacion_folio);

            $sql = "SELECT c.id, c.folio, c.fecha, e.title as 'evento', e.contacto, c.usuario_id, c.renta, e.personas as 'pax', l.lugar FROM cotizaciones c
            INNER JOIN eventos e ON c.evento_id = e.id_evento
            INNER JOIN lugares l ON e.id_lugar = l.id_lugar
            WHERE c.folio = :folio";

        } else {
            $data = array('folio' => $cotizacion_folio, 'usuario' => $usuario_id);

            $sql = "SELECT c.id, c.folio, c.fecha, e.title as 'evento', e.contacto, c.usuario_id, c.renta, e.personas as 'pax' FROM cotizaciones c
            INNER JOIN eventos e ON c.evento_id = e.id_evento
            WHERE c.folio = :folio AND c.usuario_id = :usuario";
        }

        $cotizacion = \Conexion::query($sql, $data, true);
        return $cotizacion;
    }

    /**
     * OBTENER DETALLE COTIZACIÓN
     */
    public function getDetalleCot($cotizacion_id)
    {
        $sql = "SELECT id, descripcion, precio_unitario, cantidad, subtotal FROM
        detalle_cotizacion WHERE cotizacion_id = ?";

        $detalle = \Conexion::query($sql, [$cotizacion_id], true);
        return $detalle;
    }

    /**
     * OBTENER EL TOTAL DE LA COTIZACION
     */
    public function getTotalCot($folio) {
        $sql = "SELECT c.renta, SUM(d.subtotal) as 'alimentos', IFNULL(c.renta + SUM(d.subtotal), c.renta) as 'total'
        FROM detalle_cotizacion d RIGHT JOIN cotizaciones c
        ON d.cotizacion_id = c.id
        WHERE c.folio = ?;";

        $select = \Conexion::query($sql, [$folio], true);
        if (count($select) > 0) {
            return $select[0];
        } else {
            return null;
        }
    }

    /**
     * OBTENER VALIDACION RENTA
     */
    public function getValidacionRenta($validacion_id) {
        $sql = "SELECT * FROM validaciones_renta WHERE id = :validacion_id";

        $rentaData = \Conexion::query($sql, array('validacion_id' => $validacion_id));
        return $rentaData;
    }

    /**
     * VALIDA FOLIO COTIZACION
     */
    private function validaFolioCot($folio) {
        $sql        = "SELECT folio FROM cotizaciones WHERE folio = :folio";
        $cotizacion = \Conexion::query($sql, array('folio' => $folio), true);
        $validacion = true;

        if (count($cotizacion) > 0) {
            $validacion = false;
        } else {
            $validacion = true;
        }
        return $validacion;
    }

    /**
     * OBTENER ID COTIZACION
     */
    public function getCotId($folio)
    {
        $sql = "SELECT id FROM cotizaciones WHERE folio = :folio";
        $cotizacion = \Conexion::query($sql, array('folio' => $folio), true);

        if (count($cotizacion) > 0) {
            return (int) $cotizacion[0]['id'];
        }
        return false;
    }

    /**
     * VALIDA SI ES EL CLIENTE
     */
    public function isCliente($nombre, $apellido, $email)
    {
        $sql = "SELECT nombre FROM clientes WHERE (nombre = :nombre AND apellido = :apellido AND email = :email)";

        $cliente = \Conexion::query($sql, array('nombre' => $nombre, 'apellido' => $apellido, 'email' => $email), true);

        if (count($cliente) > 0) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * VALIDA SI EXISTE EL CORREO
     */
    public function isEmail($email)
    {
        $sql = "SELECT email FROM clientes WHERE email = :email";
        $cliente = \Conexion::query($sql, array('email' => $email), true);

        if (count($cliente) > 0) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * CREAR FOLIO COTIZACIONES 
     */
    private function createFolio()
    {
        $sql = "SELECT folio FROM cotizaciones ORDER BY folio DESC LIMIT 1";
        $folio = \Conexion::query($sql, array(), true);

        if (count($folio) > 0) {
            return $folio[0]['folio'] + 1;
        } else {
            return 1;
        }
    }

    /**
     * BORRAR DETALLE COTIZACIÓN 
     */
    public function deleteDetalleCot($detalle_id) {
        $sql = "DELETE FROM detalle_cotizacion WHERE id = :id";

        try {
           $delete = \Conexion::query($sql, array('id' => $detalle_id));
           return true;

        } catch (\PDOException $e) {
            if ($delete->errorCode() !== 0) {
            return "Syntax Error: ". $e->getMessage();
            }
        }
    }

    /**
     * ACTUALIZAR STATUS COTIZACIÓN
     */
    public function cambiarStatus($folio, $estado) {
        $sql = "UPDATE cotizaciones SET estado = ? WHERE folio = ?";
        \Conexion::query($sql, [$estado, $folio]);
        return true;
    }

    /** 
     * VALIDAR COTIZACIÓN
     */
    public function varlidaCotizacion($cotizacion_id) {
        $sql = "SELECT folio FROM cotizaciones WHERE id = :id AND usuario_id = :usuario_id";
        $cot = \Conexion::query($sql, array('id' => $cotizacion_id, 'usuario_id' => $_SESSION['usuario']['id_usuario']), true);

        if (count($cot) > 0) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * ENVIAR EMAIL
     */
    public function enviarEmail($data, $autor) {
        $sql = "SELECT d.correo FROM usuarios u
        INNER JOIN detalle_usuario d ON d.id_usuario = u.id_usuario
		WHERE u.nivel = 'Administrador' OR u.nivel = 'Supervisor';";

        $usuarios = \Conexion::query($sql, array(), true);
        if (count($usuarios) > 0) {

            //para el envío en formato HTML 
            $headers = "MIME-Version: 1.0\r\n";
            $headers .= "Content-type: text/html; charset=iso-8859-1\r\n";

            //dirección del remitente 
            $headers .= "From: $autor <.". strtolower($_SESSION['usuario']['correo']). ">\r\n";
            
            foreach ($usuarios as $usuario) {
                mail($usuario['correo'], $data['asunto'], $data['cuerpo'], $headers);
            }
        }
    }

    /**
     * COTIZACIÓN MANUAL
     */
    public function cotizacionManual($data_post) {
        $cliente_data = array(
            'nombre'   => $data_post['nombre'],
            'apellido' => $data_post['apellido'],
            'telefono' => $data_post['telefono'],
            'email'    => $data_post['email']
        );
        // COMIENZA LA TRANSACCIÓN
        \Conexion::beginTransaction();

        try {
            // VALIDA SI EXISTE EL CORREO
            $is_email = $this->isEmail($data_post['email']);
            // SI EXITE EL CORREO VALIDA QUE SEA EL AUTOR
            if ($is_email) {
                // VALIDA SI ES EL AUTOR
                $is_autor = $this->isCliente($data_post['nombre'], $data_post['apellido'], $data_post['email']);

                if (!$is_autor) {
                    throw new \PDOException("Ya hay un cliente con ese correo");
                }
                // SI EXISTE EL CLIENTE OBTIENE SU ID
                $cliente_id = $this->getClienteId($data_post['email']);
                
            } else {
                // SI NO EXISTE EL CORREO INSERTA EL CLIENTE            
                $sql = "INSERT INTO clientes VALUES
                (null, :nombre, :apellido, :email, :telefono, NOW())";
                
                \Conexion::query($sql, $cliente_data);

                // OBTIENE EL ID DEL CLIENTE INSERTADO
                $cliente_id = \Conexion::lastInsertId();
            }
        } catch (\PDOException $e) {
            $_SESSION['error']['msg'] = '<b>Error:</b><br><br>'. $e->getMessage();
            \Conexion::rollBack();
            return false;
        }
        
        try {
            /**
             * OBTIENE LA RENTA
             */
            $renta = $this->getPrecioRenta($data_post['dia'], $data_post['mes'], $data_post['tipo_evento'], $data_post['id_lugar']);
            /** 
             * CREA Y VALIDA EL FÓLIO DE LA COTIZACIÓN
             */
            $folio_cot = $this->createFolio();
            $folio_valido = $this->validaFolioCot($folio_cot);

        } catch (\PDOException $e) {
            $_SESSION['error']['msg'] = 'Error: '. $e->getMessage();
            \Conexion::rollBack();
            return false;
        }
        // VALIDA LOS RESULTADOS SQL
        try {
            // SI NO OBTIENE EL TIPO DE EVENTO TIRA UN ERROR
            if ($data_post['tipo_evento'] < 0) {
                throw new \Exception('No se reconoce el tipo de evento');
            }
            // SI EL FOLIO NO ES VÁLIDO TIRA UN ERROR
            if (!$folio_valido) {
                throw new \Exception('No se pudo generar un folio válido');
            }
            // SI HAY ERROR EN LA RENTA TIRA UN ERROR
            if ($renta['error']) {
                throw new \Exception($renta['msg']);
            }
        } catch (\Exception $e) {
            // SI HAY ERROR TERMINA LA EJECUCIÓN
            $_SESSION['error']['msg'] = $e->getMessage();
            \Conexion::rollBack();
            return false;
        }
        /**
         * SE ARMA EL ARRAY PARA LA COTIZACIÓN 
         */
        $cot_data = array(
            'evento_id'  => $data_post['evento_id'],
            'cliente_id' => $cliente_id,
            'usuario_id' => $data_post['usuario_id'],
            'folio'      => $folio_cot,
            'renta'      => $renta['precio'],
            'personas'   => $data_post['personas']
        );
        /**
         * SE INSERTA LA COTIZACIÓN
         */
        try {
            $sql = "INSERT INTO cotizaciones VALUES
            (null, :evento_id, :cliente_id, :usuario_id, :folio, NOW(), :renta, :personas, 'pendiente', 0)";

            \Conexion::query($sql, $cot_data);
            // SI NO HAY ERROR DEVUELVE TRUE Y FINALIZA LA TRANSACCIÓN
            \Conexion::commit();
            return true;

        } catch (\PDOExeption $e) {
            $_SESSION['error']['msg'] = 'Error: '. $e->getMessage();
            \Conexion::rollBack();
           return false;
        }
    }

    public function validaUsuario($evento_id, $usuario_id) {
        $sql = "SELECT id_evento FROM eventos WHERE id_evento = ? AND id_usuario = ?";
        $res = \Conexion::query($sql, [$evento_id, $usuario_id], true);

        if (count($res) > 0) {
            $res = true;
        } else {
            $res = false;
        }
        return $res;
    }
}
