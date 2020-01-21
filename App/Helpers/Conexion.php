<?php

class Conexion
{
  private static $pdo;
  private static $stmt;

  /**
   * CONECTA A LA BASE DE DATOS
   */
  public static function init()
  {
    // CREA UN OBJETO PDO
    $base = new PDO(
      'mysql:dbname='. getenv('DB_NAME') .';host='. getenv('DB_HOST') .';charset=UTF8',
      getenv('DB_USER'),
      getenv('DB_PASSWORD'),
      DB_OPTIONS
    );
    $base->exec('SET CHARSET UTF8');
    self::$pdo = $base;
  }

  /**
   * EJECUTA LAS CONSULTAS A LA DB
   */
  public static function query($sql, $data = [], $select = false, $one = false) {
    $exec = self::$pdo->prepare($sql);
    $exec->execute($data);
    self::$stmt = $exec;

    // SI ES CONSULTA SELECT
    if ($select) {
      // SI ES SOLO UN RESULTADO
      if ($one) {
        return $exec->fetch(PDO::FETCH_ASSOC);
      }
      return $exec->fetchAll(PDO::FETCH_ASSOC);
    }
    return $exec;
  }

  /**
   * OBTIENE EL ÚLTIMO ID INSERTADO
   */
  public static function lastInsertId() {
    return self::$pdo->lastInsertId();
  }

  /**
   * COMIENSA UNA TRANSACCIÓN
   */
  public static function beginTransaction() {
    self::$pdo->beginTransaction();
  }

  /**
   * COMMIT A LA TRANSACCIÓN
   */
  public static function commit() {
    self::$pdo->commit();
  }

  /**
   * ROLLBACK A LA TRANSACCIÓN
   */
  public static function rollBack() {
    self::$pdo->rollBack();
  }

  /**
   * DEVUELVE EL NÚMERO DE COLUMNAS AFECTADAS
   */
  public static function rowCount() {
    self::$stmt->rowCount();
  }
}
// INSTACÍA LA CONEXION UNA SOLA VEZ
Conexion::init();