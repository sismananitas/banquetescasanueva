<?php

namespace App\Models;

// use App\Helpers\Conexion;

class Model extends \Conexion {

    /**
     * Nombre de la tabla
     */
    protected $table;

    /**
     * Clave, identificador del modelo un número único por tabla
     */
    protected $primaryKey;

    /**
     * Nombre de las columnas de la tabla
     */
    protected $fillable;

    /**
     * Campos que no se muestran en las consultas SELECT
     */
    protected $hidden;

    public function __construct()
    {
        /**
         * Obtiene el nombre de la tabla en base al nombre de la clase llamada en plural
         */
        $this->table = strtolower((new \ReflectionClass($this))->getShortName()) . 's';

        /**
         * Define el array
         */
        $this->fillable = [];

        $this->primaryKey = 'id';

        $this->hidden = [];
    }

    /**
     * Obtiene una instancia dependiendo del id
     * @return instance_called_class
     */
    public function find($id)
    {
        $cols = ['*'];

        if (count($this->hidden))
            $cols = $this->fillable;

        $sql = "SELECT ";

        // Recorre todos los campos permitidos
        foreach ($cols as $col) {
            if (!in_array($col, $this->hidden))
                $sql .= $col . ',';
        }

        $sql = substr($sql, 0, -1);
        $sql .= " FROM " . $this->table . " WHERE " . $this->primaryKey . " = ?";

        $model = self::query($sql, [$id['id']], true, true);
        return $model;
    }

    /**
     * Devuelve todas las intancias creables de la base de datos
     * 
     */
    public function all()
    {
        $cols = ['*'];

        if (count($this->hidden))
            $cols = $this->fillable;

        $sql = "SELECT ";

        foreach ($cols as $col) {
            if (!in_array($col, $this->hidden))
                $sql .= $col . ',';
        }

        $sql = substr($sql, 0, -1);
        $sql .= " FROM " . $this->table;

        $collection = self::query($sql, [], true);
        return $collection;
    }

    public function insert($data, $auto_increment = true)
    {
        $sql = "INSERT INTO " . $this->table . " VALUES (";

        if ($auto_increment) $sql .= "null,";

        foreach ($data as $val) {
            $sql .= "?,";
        }
        $sql = substr($sql, 0, -1);
        $sql .= ")";

        self::query($sql, $data);
        var_dump($data);
        var_dump($sql); die;
        return true;
    }

    public function update($data)
    {
        $strPrimaryKey = $this->primaryKey;
        $sql = "UPDATE " . $this->table . " SET ";

        foreach ($this as $key => $property) {
            $sql .= $key . ' = ?,';
        }
        $sql = substr($sql, 0, -1);

        $sql .= " WHERE " . $strPrimaryKey . ' = ' . $this->$strPrimaryKey;
        var_dump($data);
        var_dump($sql); die;
        self::query($sql, $data);
        return true;
    }

    /**
     * Elimina la instancia actual
     */
    public function delete()
    {
        $strPrimaryKey = $this->primaryKey;
        $sql = "DELETE FROM ". $this->table . " WHERE " . $strPrimaryKey . ' = ' . $this->$strPrimaryKey;

        self::query($sql);
        return true;
    }
}