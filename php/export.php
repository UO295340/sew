<?php
include_once 'Database.php';

session_start(); // Iniciar sesión para mensajes

try {
    // Conexión a la base de datos
    $db = new Database();
    $conn = $db->connect();

    if (!$conn) {
        throw new Exception("No se pudo conectar a la base de datos.");
    }

    // Abrir el archivo CSV para escritura
    $fileName = 'datos_tablas.csv';
    $output = fopen('php://output', 'w');

    // Configurar cabeceras para descargar el archivo
    header('Content-Type: text/csv');
    header('Content-Disposition: attachment; filename="' . $fileName . '"');
    header('Pragma: no-cache');
    header('Expires: 0');

    // Escribir la cabecera del archivo CSV
    fputcsv($output, [
        'tabla', 'nombre', 'base', 'escuderia_id', 'nacionalidad', 'fechaNac', 
        'localizacion', 'longitud', 'fecha', 'circuito_id', 'ganador_id', 'posicion'
    ]);

    // Función para escribir datos de una tabla al archivo CSV
    function exportTable($conn, $output, $table, $columns, $prefix = '') {
        $sql = "SELECT " . implode(', ', $columns) . " FROM $table";
        $stmt = $conn->query($sql);
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $data = array_merge([$table], array_values($row));
            fputcsv($output, $data);
        }
    }

    // Especificar las tablas y sus columnas
    $tables = [
        'escuderias' => ['nombre', 'base'],
        'pilotos' => ['nombre', 'escuderia_id', 'nacionalidad', 'fechaNac'],
        'circuitos' => ['nombre', 'localizacion', 'longitud'],
        'carreras' => ['fecha', 'circuito_id', 'ganador_id'],
        'resultados' => ['carrera_id', 'piloto_id', 'posicion']
    ];

    // Exportar datos de cada tabla
    foreach ($tables as $table => $columns) {
        exportTable($conn, $output, $table, $columns);
    }

    // Cerrar la conexión y el archivo CSV
    fclose($output);
    exit();

} catch (Exception $e) {
    $_SESSION['message'] = 'Error al exportar los datos: ' . $e->getMessage();
    header('Location: ../indexApp.php');
    exit();
}
