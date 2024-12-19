class ViajeF1 {
    constructor() {
        navigator.geolocation.getCurrentPosition(this.getPosicion.bind(this), this.verErrores.bind(this));
    }

    // Obtiene la posición del usuario
    getPosicion(posicion) {
        this.mensaje = "Geolocalización obtenida correctamente";
        this.longitud = posicion.coords.longitude;
        this.latitud = posicion.coords.latitude;

        this.mostrarMiUbicacion();
        this.iniciarDragAndDrop();
    }

    // Muestra los posibles errores si la geolocalización falla
    verErrores(error) {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                this.mensaje = "El usuario no permite la solicitud de geolocalización.";
                break;
            case error.POSITION_UNAVAILABLE:
                this.mensaje = "La información de geolocalización no está disponible.";
                break;
            case error.TIMEOUT:
                this.mensaje = "La solicitud de geolocalización ha caducado.";
                break;
            case error.UNKNOWN_ERROR:
                this.mensaje = "Ha ocurrido un error desconocido.";
                break;
        }
        console.log(this.mensaje); // Imprime el mensaje de error en la consola
    }

    // Muestra un mapa con los circuitos de F1 cercanos
    mostrarMiUbicacion() {
        mapboxgl.accessToken = 'pk.eyJ1IjoibmF0YWxpYTA0IiwiYSI6ImNtM3E4MnFsNDBsMDAyanNhcmtxbzB5ZWEifQ.6cgByNf8BnyghepPNtdpMQ'; // Sustituir por tu propio token de Mapbox

        const map = new mapboxgl.Map({
            container: 'mapa', // El contenedor donde se mostrará el mapa (debe existir en HTML)
            style: 'mapbox://styles/mapbox/streets-v11', // Estilo del mapa
            center: [this.longitud, this.latitud], // Centro del mapa con las coordenadas del usuario
            zoom: 5 // Nivel de zoom inicial
        });

        // Crear un marcador para la ubicación del usuario
        new mapboxgl.Marker({color: 'red'})
            .setLngLat([this.longitud, this.latitud])
            .setPopup(new mapboxgl.Popup().setText('Tu Ubicación'))
            .addTo(map);
    }

    mostrarMapaConCircuitos(){
        mapboxgl.accessToken = 'pk.eyJ1IjoibmF0YWxpYTA0IiwiYSI6ImNtM3E4MnFsNDBsMDAyanNhcmtxbzB5ZWEifQ.6cgByNf8BnyghepPNtdpMQ'; // Sustituir por tu propio token de Mapbox

        const map = new mapboxgl.Map({
            container: 'mapa', // El contenedor donde se mostrará el mapa (debe existir en HTML)
            style: 'mapbox://styles/mapbox/streets-v11', // Estilo del mapa
            center: [this.longitud, this.latitud], // Centro del mapa con las coordenadas del usuario
            zoom: 5 // Nivel de zoom inicial
        });

        // Crear un marcador para la ubicación del usuario
        new mapboxgl.Marker({color: 'red'})
            .setLngLat([this.longitud, this.latitud])
            .setPopup(new mapboxgl.Popup().setText('Tu Ubicación'))
            .addTo(map);

        // Lista de circuitos de F1 con sus coordenadas (lat, lon)
        const circuitosF1 = [
            { nombre: 'Bahréin', pais: 'Sahkir', lat: 26.0275, lon: 50.5106 },
            { nombre: 'Yeddah', pais: 'Arabia Saudí', lat: 21.5432, lon: 39.1728 },
            { nombre: 'Albert Park', pais: 'Australia', lat: -37.8497, lon: 144.9683 },
            { nombre: 'Suzuka', pais: 'Japón', lat: 34.8431, lon: 136.5410 },
            { nombre: 'Shanghai', pais: 'China', lat: 31.3381, lon: 121.2222 },
            { nombre: 'Miami', pais: 'Estados Unidos', lat: 25.7781, lon: -80.1807 },
            { nombre: 'A. Enzo e Dino Ferrari', pais: 'Italia', lat: 44.3427, lon: 11.7223 },
            { nombre: 'Mónaco', pais: 'Mónaco', lat: 43.7347, lon: 7.4206 },
            { nombre: 'Gilles Villeneuve', pais: 'Canadá', lat: 45.5073, lon: -73.5254 },
            { nombre: 'Barcelona-Catalunya', pais: 'España', lat: 41.5743, lon: 2.2619 },
            { nombre: 'Red Bull Ring', pais: 'Austria', lat: 47.2197, lon: 14.7642 },
            { nombre: 'Silverstone', pais: 'Gran Bretaña', lat: 52.0736, lon: -1.0169 },
            { nombre: 'Hungaroring', pais: 'Hungría', lat: 47.5781, lon: 19.2480 },
            { nombre: 'Spa-Francorchamps', pais: 'Bélgica', lat: 50.4370, lon: 5.9710 },
            { nombre: 'Zandvoort', pais: 'Países Bajos', lat: 52.3812, lon: 4.5400 },
            { nombre: 'Monza', pais: 'Italia', lat: 45.6150, lon: 9.2812 },
            { nombre: 'Bakú City', pais: 'Azerbaiyán', lat: 40.3777, lon: 49.8671 },
            { nombre: 'Marina Bay', pais: 'Singapur', lat: 1.2905, lon: 103.8636 },
            { nombre: 'C. of the Americas', pais: 'Estados Unidos', lat: 30.1342, lon: -97.6413 },
            { nombre: 'A. Hermanos Rodríguez', pais: 'México', lat: 19.4044, lon: -99.0904 },
            { nombre: 'José Carlos Pace (Interlagos)', pais: 'Brasil', lat: -23.7036, lon: -46.6997 },
            { nombre: 'Las Vegas', pais: 'Estados Unidos', lat: 36.1440, lon: -115.1480 },
            { nombre: 'Losail', pais: 'Qatar', lat: 25.4978, lon: 51.4583 },
            { nombre: 'Yas Marina', pais: 'Emiratos Árabes', lat: 24.4672, lon: 54.6038 }
        ];

        // Muestra los circuitos cercanos en el mapa
        circuitosF1.forEach(circuito => {
            const distancia = this.calcularDistancia(this.latitud, this.longitud, circuito.lat, circuito.lon);
            if (distancia <= 2000) { // Solo se muestran los circuitos a menos de 1000 km
                const popup = new mapboxgl.Popup().setHTML(`<h3>${circuito.nombre}</h3><p>Distancia desde tu ubicación: ${distancia.toFixed(2)} km</p>`);
                new mapboxgl.Marker()
                    .setLngLat([circuito.lon, circuito.lat])
                    .setPopup(popup)
                    .addTo(map);
            }
        });
    }

    // Función para calcular la distancia entre dos coordenadas en km
    calcularDistancia(lat1, lon1, lat2, lon2) {
        const R = 6371; // Radio de la Tierra en km
        const dLat = this.toRad(lat2 - lat1);
        const dLon = this.toRad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distancia en km
    }

    // Función para convertir grados a radianes
    toRad(degrees) {
        return degrees * Math.PI / 180;
    }

    // Iniciar el Drag and Drop
    iniciarDragAndDrop() {
        // Seleccionar el área de arrastre (segundo <section>)
        const dropArea = document.querySelector('section > section');
        const fileInfo = document.querySelector('section > article'); // Donde se mostrará la información del archivo

        // Prevenir el comportamiento por defecto (para permitir el drop)
        dropArea.addEventListener('dragover', (e) => {
            e.preventDefault(); // Evitar el comportamiento por defecto para permitir el drop
            dropArea.style.backgroundColor = '#f0f0f0'; // Cambiar el color de fondo cuando el archivo está sobre el área
        });

        // Revertir el cambio de color cuando el archivo sale del área
        dropArea.addEventListener('dragleave', (e) => {
            dropArea.style.backgroundColor = '#fff'; // Volver al color original
        });

        // Manejar el evento drop (cuando el archivo es soltado)
        dropArea.addEventListener('drop', (e) => {
            e.preventDefault(); // Evitar el comportamiento por defecto para que el archivo se procese correctamente
            dropArea.style.backgroundColor = '#fff'; // Volver al color original

            const files = e.dataTransfer.files; // Obtener los archivos arrastrados
            if (files.length > 0) {
                const file = files[0]; // Solo tomamos el primer archivo
                fileInfo.innerHTML = `<p>Archivo cargado: ${file.name}</p>`; // Mostrar nombre del archivo

                // Si el archivo es una imagen, mostrarla
                if (file.type.startsWith('image/')) {
                    const img = document.createElement('img');
                    img.src = URL.createObjectURL(file); // Crear una URL temporal para el archivo
                    img.style.maxWidth = '100%';
                    img.style.marginTop = '10vh'; // Agregar margen superior
                    fileInfo.appendChild(img); // Agregar la imagen al área de información
                } else {
                    fileInfo.innerHTML += '<p>Archivo no compatible para visualización.</p>';
                }
            }
        });

    }

    activarPantallaCompleta() {
        const mapa = document.getElementById('mapa'); // Selecciona el elemento del mapa
        if (mapa.requestFullscreen) {
            mapa.requestFullscreen(); // Activa pantalla completa en navegadores modernos
        } else if (mapa.mozRequestFullScreen) { // Firefox
            mapa.mozRequestFullScreen();
        } else if (mapa.webkitRequestFullscreen) { // Chrome, Safari y Opera
            mapa.webkitRequestFullscreen();
        } else if (mapa.msRequestFullscreen) { // Internet Explorer/Edge
            mapa.msRequestFullscreen();
        }
    }
    
}

// Inicializa la clase ViajeF1
const viajeF1 = new ViajeF1();
