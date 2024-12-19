<?php
class Database {
    private $server = "localhost";
    private $user = "DBUSER2024";
    private $pass = "DBPSWD2024";
    private $dbname = "formula1"; // Base de datos que quieres crear y usar
    public $conn;

    public function connect() {
        try {
            // Conectarse al servidor MySQL sin especificar la base de datos
            $dsn = "mysql:host=$this->server;charset=utf8";
            $this->conn = new PDO($dsn, $this->user, $this->pass);

            // Establecer el modo de error de PDO para excepciones
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            // Intentar crear la base de datos si no existe
            $this->conn->exec("CREATE DATABASE IF NOT EXISTS $this->dbname");

            // Seleccionar la base de datos
            $this->conn->exec("USE $this->dbname");

            // Devolver la conexión
            return $this->conn;
        } catch (PDOException $e) {
            // Si ocurre un error, lo mostramos
            echo "Error de conexión: " . $e->getMessage();
            return null;
        }
    }

    public function close() {
        $this->conn = null;
    }
}
?>

