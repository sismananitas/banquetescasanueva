<?php

$tabla = $_POST['tabla'];
$obj_tabla = new Tabla($tabla);

if (isset($_POST['tabla2']) && isset($_POST['tabla3'])) {
   $data_json = $obj_tabla->obtener_datos_join_join($_POST['tabla2'], $_POST['on'], $_POST['tabla3'], $_POST['on2']);

} else {
   $json = array(
      'enero' => obtenerVentas($_POST['year'], '01'),
      'febrero' => obtenerVentas($_POST['year'],'02'),
      'marzo' => obtenerVentas($_POST['year'], '03'),
      'abril' => obtenerVentas($_POST['year'], '04'),
      'mayo' => obtenerVentas($_POST['year'], '05'),
      'junio' => obtenerVentas($_POST['year'], '06'),
      'julio' => obtenerVentas($_POST['year'], '07'),
      'agosto' => obtenerVentas($_POST['year'], '08'),
      'septiembre' => obtenerVentas($_POST['year'], '09'),
      'octubre' => obtenerVentas($_POST['year'], '10'),
      'noviembre' => obtenerVentas($_POST['year'], '11'),
      'diciembre' => obtenerVentas($_POST['year'],'12')
   );

   $data_json = $json;
}

header('Content-type: aplication/json');
echo json_encode($data_json);

function obtenerVentas($year, $mes) {
   $inicio = $year . '/'. $mes . '/01';
   $final = $year. '/' . $mes . '/31';

   $sql = "SELECT * FROM eventos WHERE start between '$inicio' AND '$final'";
   $res = Conexion::query($sql, array(), true);

   return sizeof($res);
}

?>