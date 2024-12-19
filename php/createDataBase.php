<?php
include_once 'Database.php';

$db = new Database();
$conn = $db->connect(); // Conectar al servidor y crear/usar la base de datos

// Asegurarnos de que la conexión fue exitosa antes de proceder
if ($conn) {
    $sql = file_get_contents('create_database.sql'); // Cargar el archivo SQL que crea las tablas

    try {
        $conn->exec($sql); // Ejecutar el archivo SQL para crear las tablas
        // Redirigir a la página con un mensaje de éxito
        header("Location: ../indexApp.php?db_status=success");
        exit;
    } catch (PDOException $e) {
        // Redirigir a la página con un mensaje de error
        header("Location: ../indexApp.php?db_status=error&message=" . urlencode($e->getMessage()));
        exit;
    }
} else {
    // Si la conexión falla, redirigir con mensaje de error
    header("Location: ../indexApp.php.php?db_status=error&message=Error de conexión");
    exit;
}
?>

