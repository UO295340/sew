<?php
// Declaración de la clase Carrusel
class Carrusel {
    private $capital;
    private $pais;

    public function __construct($capital, $pais){
        $this->capital = $capital;
        $this->pais = $pais;
    }

    public function obtenerFotos(){
        $apiKey = 'aee626b7aebf766aeabd8cf240ab4c0f';
        $url = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=' . $apiKey . 
       '&text=' . urlencode($this->capital . ' ' . $this->pais) . '&license=1,2,4,5&per_page=10&page=1&format=json&nojsoncallback=1';

        $response = file_get_contents($url);
        $data = json_decode($response, true);

        if($data && isset($data['photos']['photo'])){
            foreach($data['photos']['photo'] as $photo){
                $photoUrl = 'https://live.staticflickr.com/' . $photo['server'] . '/' . $photo['id'] . '_' . $photo['secret'] . '.jpg';
                $this->fotos[] = $photoUrl;
            }
        }
    }

    public function mostrarCarrusel(){
        if (empty($this->fotos)) {
            echo "<p>No se encontraron fotos para este país.</p>";
            return;
        }

        echo '<article>';
        echo '<h3>Carrusel de Imágenes</h3>';
        foreach ($this->fotos as $foto) {
            echo '<img src="' . $foto . '" alt="Foto del país" />';
        }
        echo '<button>&gt;</button>';
        echo '<button>&lt;</button>';
        echo '</article>';
    }
}

// Declaracion de la clase Moneda
class Moneda {
    private $monedaLocal;
    private $monedaReferencia;

    public function __construct($monedaLocal, $monedaReferencia){
        $this->monedaLocal = $monedaLocal;
        $this->monedaReferencia = $monedaReferencia;
    }

    public function obtenerCambio(){
        $apiKey = 'c2b21d187daad8d35213adec';
        $url = "https://v6.exchangerate-api.com/v6/$apiKey/latest/{$this->monedaReferencia}";

        $responseJson = file_get_contents($url);

        if($responseJson == false){
            return "No se pudo obtener la tasa de cambio.";
        }

        $response = json_decode($responseJson,true);
        if($response['result'] == 'success'){
            return $response['conversion_rates'][$this->monedaLocal] ?? "Tasa no disponible.";
        } else {
            return "Error en la consulta: {$response['error-type']}";
        }
    }
}
// $moneda = new Moneda("EUR", "USD");
// $tasaCambio = $moneda->obtenerCambio();
?>

<!DOCTYPE HTML>

<html lang="es">

<head>
    <!-- Datos que describen el documento -->
    <meta charset="UTF-8" />

    <!-- Título-->
    <title>Viajes F1</title>

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

    <!-- Favicon-->
    <link rel="icon" href="multimedia/imagenes/favicon.ico" />

    <!-- Referencia a la biblioteca jQuery minificada -->
    <script src="https://code.jquery.com/jquery-3.7.1.min.js"
        integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=" crossorigin="anonymous"></script>

    <!-- Mapbox GL JS -->
    <link href="https://api.mapbox.com/mapbox-gl-js/v3.8.0/mapbox-gl.css" rel="stylesheet">
    <script src="https://api.mapbox.com/mapbox-gl-js/v3.8.0/mapbox-gl.js"></script>

    <!-- Incluir el archivo viajes.js-->
    <script src="js/viajes.js"></script>

    <style>
        article {
            width: 100%;
            max-width: 100vh;
            height: 70vh;
            position: relative;
            overflow: hidden;
            border-radius: 1em;
        }

        article h3 {
            width: 100%;
            text-align: center;
            margin-bottom: 0.5em;
            font-size: 2em;
        }

        article img {
            width: 100%;
            max-width: 100vh;
            height: 60vh;
            position: absolute;
            transition: all 0.5s;
            object-fit: cover;
            border-radius: 0.5em;
        }

        button {
            position: absolute;
            width: 2em;
            height: 2em;
            padding: 0.5em;
            border: none;
            border-radius: 50%;
            z-index: 10;
            cursor: pointer;
            background-color: #fff;
            font-size: 1em;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }

        button:active {
            transform: scale(1.1);
        }

        button:nth-of-type(2) {
            top: 50%;
            left: 2%;
        }

        button:nth-of-type(1) {
            top: 50%;
            right: 2%;
        }
    </style>
</head>

<body>
    <header>
        <!-- Datos con el contenidos que aparece en el navegador -->
        <a href="index.html" title="Inicio F1Desktop">
            <h1>F1 Desktop</h1>
        </a>
        <nav>
            <a href="index.html" title="Inicio F1Desktop"> Inicio</a>
            <a href="piloto.html" title="Piloto F1"> Piloto</a>
            <a href="noticias.html" title="Noticias F1"> Noticias</a>
            <a href="calendario.html" title="Calendario F1"> Calendario</a>
            <a href="meteorologia.html" title="Metereología"> Metereología</a>
            <a href="circuito.html" title="Circuitos F1"> Circuitos</a>
            <a href="viajes.php" title="Viajes" class="active"> Viajes</a>
            <a href="juegos.html" title="Juegos"> Juegos</a>

        </nav>
    </header>
    <!-- Migas de navegación -->
    <p>Estás en: <a href="index.html" title="Inicio F1Desktop">Inicio</a> >>Viajes</p>

    <!-- <p>Cambio de Moneda</p>
    <p>1 USD equivale a: <?php echo $tasaCambio; ?> EUR</p> -->

    <section>
        <!-- Aquí ira el mapa estatico-->
    </section>
    <div id="mapa">
        <!--Aqui ira el mapa dinamico-->
    </div>

    <?php
    $viaje = new Carrusel("Brasilia", "Brasil");
    $viaje->obtenerFotos();
    $viaje->mostrarCarrusel();
    ?>

    <script>
        const slides = document.querySelectorAll("img");
        const nextSlide = document.querySelector("button:nth-of-type(1)");
        const prevSlide = document.querySelector("button:nth-of-type(2)");
        let curSlide = 0;
        const maxSlide = slides.length - 1;

        nextSlide.addEventListener("click", function () {
            if (curSlide === maxSlide) {
                curSlide = 0;
            } else {
                curSlide++;
            }

            slides.forEach((slide, indx) => {
                slide.style.transform = `translateX(${100 * (indx - curSlide)}%)`;
            });
        });

        prevSlide.addEventListener("click", function () {
            if (curSlide === 0) {
                curSlide = maxSlide;
            } else {
                curSlide--;
            }

            slides.forEach((slide, indx) => {
                slide.style.transform = `translateX(${100 * (indx - curSlide)}%)`;
            });
        });
    </script>

</body>

</html>