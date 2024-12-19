<?php
// Clase Record
class Record {
    public $server;
    public $user;
    public $pass;
    public $dbname;

    public function __construct(){
        $this->server = "localhost";
        $this->user = "DBUSER2024";
        $this->pass = "DBPSWD2024";
        $this->dbname = "records";

        // establece la conexion a la base de datos
        $this->conn = new mysqli($this->server, $this->user, $this->pass, $this->dbname);

        if($this->conn->connect_error){
            die("Error de conexión: " . $this->conn->connect_error);
        }
    }

    public function saveRecord($nombre, $apellidos, $nivel, $tiempo){
        $sql = "INSERT INTO registro (nombre, apellidos, nivel, tiempo) VALUES (?,?,?,?)";

        $stmt = $this->conn->prepare($sql);
        if(!$stmt){
            die("Error al preparar la consulta: " .$this->conn->error);
        }

        $stmt->bind_param("sssd", $nombre, $apellidos, $nivel, $tiempo);
        if(! $stmt->execute()){
            echo "Error al guardar el registro: ".$stmt->error;
        }

        $stmt->close();
    }

    public function getTopRecords($nivel){
        $sql = "SELECT nombre, apellidos, tiempo FROM registro WHERE nivel = ? ORDER BY tiempo ASC LIMIT 10";
        $stmt = $this->conn->prepare($sql);

        if($stmt){
            $stmt->bind_param("s", $nivel);
            $stmt->execute();
            $result = $stmt->get_result();
            $records = $result->fetch_all(MYSQLI_ASSOC);
            $stmt->close();
            return $records;
        } else {
            echo "Error al preparar la consulta: " . $this->conn->error;
            return [];
        }
    }

    public function __destruct(){
        $this->conn->close();
    }
}

if($_SERVER['REQUEST_METHOD'] === 'POST'){
    $nombre = $_POST['nombre'] ?? '';
    $apellidos = $_POST['apellidos'] ?? '';
    $nivel = $_POST['nivel'] ?? '';
    $tiempo = floatval($_POST['tiempo'] ?? '');

    if ($nombre && $apellidos && $nivel && $tiempo) {
        $record = new Record();
        $record->saveRecord($nombre, $apellidos, $nivel, $tiempo);

        // Mostrar la tabla de los 10 mejores récords
        $topRecords = $record->getTopRecords($nivel);

        echo "<h3>Los 10 mejores resultados para el nivel $nivel</h3>";
        echo "<ol>";
        foreach ($topRecords as $row) {
            echo "<li>" . htmlspecialchars($row['nombre']) . " " . 
                        htmlspecialchars($row['apellidos']) . " - " . 
                        number_format($row['tiempo'], 2) . " ms</li>";
        }
        echo "</ol>";
    } else {
        echo "Por favor, completa todos los campos.";
    }
}
?>

<!DOCTYPE HTML>

<html lang="es">

<head>
    <!-- Datos que describen el documento -->
    <meta charset="UTF-8" />

    <!-- Título-->
    <title>Juegos F1</title>

    <!-- Nombre del autor -->
    <meta name="author" content="Natalia Blanco Agudín" />

    <!-- Descripción del documento -->
    <meta name="description" content="Documento para utilizar en otros módulos de la asignatura" />

    <!-- Palabras claves del sitio -->
    <meta name="keywords" content="F1" />

    <!-- Ventana gráfica -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <!-- Hoja de estilos -->
    <link rel="stylesheet" type="text/css" href="estilo/estilo.css" />
    <link rel="stylesheet" type="text/css" href="estilo/layout.css" />
    <link rel="stylesheet" type="text/css" href="estilo/semaforo.css" />

    <!-- Favicon-->
    <link rel="icon" href="multimedia/imagenes/favicon.ico" />

    <!-- Incluir el archivo semaforo.js-->
    <script src="js/semaforo.js"></script>
    <script src="https://code.jquery.com/jquery-3.6.4.min.js"></script>
    

</head>

<body>
    <header>
        <!-- Datos con el contenidos que aparece en el navegador -->
        <a href="index.html" title="Inicio F1Desktop">
            <h1>F1 Desktop</h1>
        </a>
        <!-- Menú principal de navegación -->
        <nav>
            <a href="index.html" title="Inicio F1Desktop"> Inicio</a>
            <a href="piloto.html" title="Piloto F1"> Piloto</a>
            <a href="noticias.html" title="Noticias F1"> Noticias</a>
            <a href="calendario.html" title="Calendario F1"> Calendario</a>
            <a href="meteorologia.html" title="Metereología"> Metereología</a>
            <a href="circuito.html" title="Circuitos F1"> Circuitos</a>
            <a href="viajes.html" title="Viajes"> Viajes</a>
            <a href="juegos.html" title="Juegos" class="active"> Juegos</a>

        </nav>

        <nav>
            <a href="memoria.html" title="Juego de memoria"> Juego de memoria</a>
            <a href="semaforo.php" title="Juego del semaforo" class="active"> Juego del semáforo</a>
            <!-- <a href="semaforo.html" title="Juego del semaforo"> Juego del semáforo</a> -->
            <a href="indexApp.php" title="Aplicación F1">Aplicación F1</a>
            <a href="api.html" title="Localizacion de circuitos">Localizacion de circuitos</a>
        </nav>
    </header>
    <!-- Migas de navegación -->
    <p>Estás en: <a href="index.html" title="Inicio F1Desktop">Inicio</a> >> <a href="juegos.html"
        title="Juegos">Juegos</a> >> Juego del semáforo</p>

    <main>
        <!-- Aqui se generará el juego-->
    </main>

    <script>
        const juegoSemaforo = new Semaforo();
    </script>

</body>

</html>