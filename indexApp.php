<!DOCTYPE HTML>

<html lang="es">

<head>
    <!-- Datos que describen el documento -->
    <meta charset="UTF-8" />

    <!-- Título-->
    <title>F1 Índice</title>

    <!-- Nombre del autor -->
    <meta name="author" content="Natalia Blanco Agudín" />

    <!-- Descripción del documento -->
    <meta name="description" content="Documento inicial del F1 Desktop" />

    <!-- Palabras claves del sitio -->
    <meta name="keywords" content="F1" />

    <!-- Ventana gráfica -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <!-- Hoja de estilos -->
    <link rel="stylesheet" type="text/css" href="estilo/estilo.css" />
    <link rel="stylesheet" type="text/css" href="estilo/layout.css" />
    <link rel="stylesheet" type="text/css" href="estilo/estilo_app.css" />
    
    <!-- Favicon-->
    <link rel="icon" href="multimedia/imagenes/favicon.ico" />

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
            <a href="viajes.php" title="Viajes"> Viajes</a>
            <a href="juegos.html" title="Juegos" class="active"> Juegos</a>

        </nav>

        <nav>
            <a href="memoria.html" title="Juego de memoria"> Juego de memoria</a>
            <a href="semaforo.php" title="Juego del semaforo"> Juego del semáforo</a>
            <!-- <a href="semaforo.html" title="Juego del semaforo"> Juego del semáforo</a> -->
            <a href="indexApp.php" title="Aplicación F1" class="active">Aplicación F1</a>
            <a href="api.html" title="Localizacion de circuitos">Localizacion de circuitos</a>
        </nav>
    </header>
    <!-- Migas de navegación -->
    <p>Estás en: <a href="index.html" title="Inicio F1Desktop">Inicio</a> >> <a href="juegos.html"
        title="Juegos">Juegos</a> >> Aplicación F1</p>


    <main>
        <h2>Aplicación F1</h2>
        <p>Esta aplicación te permite gestionar una base de datos de Fórmula 1.</p>
        <p>Usa las siguientes opciones para interactuar con los datos.</p>

        <!-- Mostrar el mensaje de éxito o error -->
        <?php if (isset($_GET['db_status'])): ?>
            <?php if ($_GET['db_status'] == 'success'): ?>
                <p>¡Base de datos creada exitosamente!</p>
            <?php elseif ($_GET['db_status'] == 'error'): ?>
                <p>Error: <?php echo isset($_GET['message']) ? htmlspecialchars($_GET['message']) : 'Hubo un error al crear la base de datos.'; ?></p>
            <?php endif; ?>
        <?php endif; ?>
        
        <!-- Mostrar el mensaje si existe -->
        <?php
        session_start();
        if (isset($_SESSION['message'])) {
            echo '<p>' . $_SESSION['message'] . '</p>';
            unset($_SESSION['message']); // Limpiar el mensaje después de mostrarlo
        }
        ?>

        <section>
            <article>
                <h3>Crear Base de Datos</h3>
                <p>Crea la base de datos para comenzar a gestionar los datos de la F1.</p>
                <form action="php/createDataBase.php" method="POST">
                    <button type="submit">
                        Crear
                    </button>
                </form>
            </article>

            <article>
                <h3>Importar CSV</h3>
                <p>Importa un archivo CSV con datos de la F1 para añadirlos a la base de datos.</p>
                <form action="php/import.php" method="POST" enctype="multipart/form-data">
                    <!-- <label for="csvFile">Importar CSV:</label> -->
                    <input type="file" name="csvFile" id="csvFile" accept=".csv" required>
                    <button type="submit">
                        Importar
                    </button>
                </form>
            </article>

            <article>
                <h3>Exportar Datos</h3>
                <p>Exporta los datos de la F1 en formato CSV para utilizarlos en otras aplicaciones.</p>
                <form action="php/export.php" method="GET">
                    <button type="submit">
                        Exportar Datos
                    </button>
                </form>
            </article>
            
        </section>
    </main>
</body>
</html>