<?php

namespace App\Models;

class Sesion extends Model
{
	private $user;
	private $pass;

	public function __construct($user = '', $pass = '')
	{
		parent::__construct();
		$this->user = $user;
		$this->pass = $pass;
	}

	public function getArrayUser()
	{
		return [
			'user'   => $this->user,
			'pass'   => $this->pass,
			'estado' => '1',
		];
	}

	public function iniciarSesion()
	{
		$data = $this->getArrayUser();

		$sql = "SELECT u.id_usuario, u.username, u.nivel
		as 'rol', d.nombre, d.apellidos, d.correo
		FROM usuarios u
		LEFT JOIN detalle_usuario d
		ON u.id_usuario = d.id_usuario
		WHERE username COLLATE utf8_bin = :user
		AND pass = :pass
		AND estado = :estado";

		$session = self::query($sql, $data, true);

		if (count($session) > 0) {
			$_SESSION['usuario'] = (array) $session[0];
			return true;
		} else {
			return false;
		}
	}
}
