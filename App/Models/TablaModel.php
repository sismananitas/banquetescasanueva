<?php

namespace App\Models;

class TablaModel
{
  private $nombre;

  public function __construct($nombre = '')
  {
    $this->nombre = $nombre;
  }

  /** OBTIENE TODOS LOS REGISTROS */
  public function obtener_datos()
  {
    $sql = "SELECT * FROM $this->nombre";
    return \Conexion::query($sql, array(), true);
  }

  /**----- OBTIENE LOS REGISTROS CON EL CAMPO Y VALOR RECIBIDOS -----*/
  public function obtener_datos_donde($campo, $valor)
  {
    $data = array("$campo" => $valor);
    
    $sql = "SELECT * FROM $this->nombre
    WHERE $campo = :$campo";

    return \Conexion::query($sql, $data, true);
  }

  /**-------- OBTIENE LOS REGISTROS DE DOS TABLAS CON INNER JOIN ---------*/
  public function obtener_datos_join($tabla2, $on, $campo = '', $value = '')
  {
    if ($campo == '' || $value == '') {
      $sql = "SELECT * FROM $this->nombre
      INNER JOIN $tabla2 ON $this->nombre.$on = $tabla2.$on";

      $data = array();

    } else if (!empty($campo) && !empty($value)) {
      $sql = "SELECT * FROM $this->nombre
      INNER JOIN $tabla2 ON $this->nombre.$on = $tabla2.$on
      WHERE $this->nombre.$campo = :$campo";
      
      $data = array($campo => $value);
    }
    return \Conexion::query($sql, $data, true);
  }

  /**-------- OBTIENE LOS REGISTROS ORDENADOS ---------*/
  public function obtener_datos_orden($campo, $valor) {
    $sql = "SELECT * FROM $this->nombre ORDER BY $campo $valor";

    $res = \Conexion::query($sql, array(), true);
    return $res;
  }

  /**-------- OBTIENE LOS REGISTROS DE DOS TABLAS CON LEFT JOIN ---------*/
  public function obtener_datos_left_join($tabla2, $on, $campo = '', $value = '')
  {
    $data = array();
    
    if ($campo == '' || $value == '') {
      /** SI TIENE CAMPOS OPCIONALES */
      $sql = "SELECT * FROM $this->nombre
      LEFT JOIN $tabla2 ON $this->nombre.$on = $tabla2.$on";

    } else if (!empty($campo) && !empty($value)) {
      /** SI NI TIENE CAMPOS OPCIONALES */
      $data = array(
        $campo => $value
      );

      $sql = "SELECT * FROM $this->nombre
      LEFT JOIN $tabla2 ON $this->nombre.$on = $tabla2.$on
      WHERE $this->nombre.$campo = :$campo";
    }
    /** EJECUTA LA CONSULTA */
    return \Conexion::query($sql, $data, true);
  }

  /**------ OBTIENE LOS REGISTROS DE TRES TABLAS CON INNER JOIN ---------*/
  public function obtener_datos_join_join($tabla2, $on, $tabla3, $on2)
  {
    $sql = "SELECT * FROM $this->nombre
    INNER JOIN $tabla2 ON $this->nombre.$on = $tabla2.$on
    INNER JOIN $tabla3 ON $this->nombre.$on2 = $tabla3.$on2
    ORDER BY lugar ASC";  // Quitar

    $res = \Conexion::query($sql, array(), true, false);
    return $res;
  }

  /** OBTIENE EL NOMBRE DE LA TABLA */
  public function setName($tabla)
  {
    $this->nombre = $tabla;
  }

  public function __destruct()
  {
    $this->nombre;
  }
}
