<?php
include_once 'Database.php';

session_start(); // Iniciar sesión para almacenar mensajes

// Función para insertar datos en una tabla
function insertCsvData($conn, $table, $columns, $csvData) {
    $sql = "INSERT INTO $table (" . implode(',', $columns) . ") VALUES (:" . implode(',:', $columns) . ")";
    $stmt = $conn->prepare($sql);
    $inserted = false; // Variable para verificar si se insertaron datos

    foreach ($csvData as $row) {
        if (count($row) == count($columns)) {
            $data = array_combine($columns, $row);
            try {
                if ($stmt->execute($data)) {
                    $inserted = true; // Si se insertaron datos, marcamos como insertado
                }
            } catch (PDOException $e) {
                // Detectar errores de clave única
                if ($e->getCode() == 23000) { // Código SQLSTATE para violaciones de restricciones
                    $_SESSION['message'] = "Error: No puede haber datos duplicados (los nombres de los pilotos, circuitos y escuderías han de ser distintos)";
                } else {
                    $_SESSION['message'] = "Error al insertar en la tabla $table: " . $e->getMessage();
                }
                header('Location: ../indexApp.php');
                exit();
            }
        }
    }

    return $inserted; // Retornamos si se insertaron datos
}

// Procesar el archivo CSV
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['csvFile'])) {
    $csvFile = $_FILES['csvFile']['tmp_name'];
    $fileName = $_FILES['csvFile']['name'];
    $fileExtension = pathinfo($fileName, PATHINFO_EXTENSION);

    // Validar si el archivo es un CSV
    if ($fileExtension !== 'csv') {
        $_SESSION['message'] = 'Por favor, sube un archivo CSV válido.';
        header('Location: ../indexApp.php'); // Redirige a la página principal
        exit();
    }

    // Intentar abrir el archivo CSV
    if (($handle = fopen($csvFile, 'r')) !== FALSE) {
        $csvData = [];
        $isEmpty = true; // Para verificar si el archivo está vacío

        // Leer el archivo CSV línea por línea
        while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
            // Si se leen datos, se considera que el archivo no está vacío
            if (count($data) > 0) {
                $csvData[] = $data;
                $isEmpty = false;
            }
        }
        fclose($handle);

        if ($isEmpty) {
            $_SESSION['message'] = 'El archivo CSV está vacío.';
            header('Location: ../indexApp.php');
            exit();
        }

        $db = new Database();
        $conn = $db->connect();

        if ($conn) {
            $tables = [
                'escuderias' => ['nombre', 'base'],
                'pilotos' => ['nombre', 'escuderia_id', 'nacionalidad', 'fechaNac'],
                'circuitos' => ['nombre', 'localizacion', 'longitud'],
                'carreras' => ['fecha', 'circuito_id', 'ganador_id'],
                'resultados' => ['carrera_id', 'piloto_id', 'posicion']
            ];

            $insertedAnyData = false; // Variable para verificar si se insertaron datos en alguna tabla

            // Insertar datos en las tablas correspondientes
            foreach ($csvData as $row) {
                $table = $row[0]; // Obtener la tabla desde la primera columna del CSV
                if (array_key_exists($table, $tables)) {
                    $columns = $tables[$table];
                    $tableData = array_slice($row, 1, count($columns)); // Excluye el nombre de la tabla
                    if (insertCsvData($conn, $table, $columns, [$tableData])) {
                        $insertedAnyData = true; // Si se insertaron datos, marcar como verdadero
                    }
                }
            }

            // Verificar si se insertaron datos en alguna tabla
            if ($insertedAnyData) {
                $_SESSION['message'] = 'Datos importados correctamente en todas las tablas.';
            } else {
                $_SESSION['message'] = 'El archivo CSV no contiene datos válidos para insertar.';
            }

            header('Location: ../indexApp.php'); // Redirige a la página principal
            exit();
        } else {
            $_SESSION['message'] = 'Error de conexión a la base de datos.';
            header('Location: ../indexApp.php'); // Redirige a la página principal
            exit();
        }
    } else {
        $_SESSION['message'] = 'No se pudo leer el archivo CSV.';
        header('Location: ../indexApp.php'); // Redirige a la página principal
        exit();
    }
} else {
    $_SESSION['message'] = 'No se ha subido ningún archivo.';
    header('Location: ../indexApp.php'); // Redirige a la página principal
    exit();
}
?>