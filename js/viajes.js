class Viajes {
    constructor() {
        navigator.geolocation.getCurrentPosition(this.getPosicion.bind(this), this.verErrores.bind(this));
    }

    // Coge la posicion
    getPosicion(posicion) {
        this.mensaje = "Se ha realizado correctamente la petición de geolocalización";
        this.longitud = posicion.coords.longitude;
        this.latitud = posicion.coords.latitude;

        this.getMapaEstaticoMapBox();
        this.getMapaDinamicoMapBox();
    }

    // muestra si se ha producido algun error
    verErrores(error) {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                this.mensaje = "El usuario no permite la petición de geolocalización"
                break;
            case error.POSITION_UNAVAILABLE:
                this.mensaje = "Información de geolocalización no disponible"
                break;
            case error.TIMEOUT:
                this.mensaje = "La petición de geolocalización ha caducado"
                break;
            case error.UNKNOWN_ERROR:
                this.mensaje = "Se ha producido un error desconocido"
                break;
        }
    }

    // muestra la informacion (ya no se usa)
    mostrarInfo() {
        const ubicacion = document.querySelector('section');
        const article = document.createElement('article');

        article.innerHTML = `
                    <p>${this.mensaje}</p>
                    <p>${this.longitud}</p>
                    <p>${this.latitud}</p>
                    `;

        ubicacion.appendChild(article);
    }

    // Muestra un mapa estatico
    getMapaEstaticoMapBox() {
        const accessToken = 'pk.eyJ1IjoibmF0YWxpYTA0IiwiYSI6ImNtM3E4MnFsNDBsMDAyanNhcmtxbzB5ZWEifQ.6cgByNf8BnyghepPNtdpMQ';
        const username = 'mapbox';
        const style_id = 'streets-v11'; // Puedes cambiar a otro estilo como 'satellite-v9'
        const zoom = 15; // Nivel de zoom
        const bearing = 0; // Orientación del mapa
        const pitch = 0; // Inclinación del mapa
        const width = 800; // Ancho de la imagen
        const height = 600; // Alto de la imagen

        // Crear el marcador
        const marker = `pin-l+ff0000(${this.longitud},${this.latitud})`; // Marcador rojo en las coordenadas

        // Construir la URL con el marcador incluido
        const url = `https://api.mapbox.com/styles/v1/${username}/${style_id}/static/${marker}/${this.longitud},${this.latitud},${zoom},${bearing},${pitch}/${width}x${height}?access_token=${accessToken}`;

        // Seleccionar el contenedor donde se mostrará el mapa
        const section = document.querySelector('section');

        // Limpiar la sección antes de insertar la nueva imagen
        section.innerHTML = '';  // Esto asegura que no se dupliquen las imágenes si el mapa estático ya se ha cargado

        // Crear y mostrar la imagen
        const img = document.createElement('img');
        img.src = url;
        img.alt = 'Mapa estático de Mapbox';
        section.appendChild(img);
    }

    getMapaDinamicoMapBox() {
        mapboxgl.accessToken = 'pk.eyJ1IjoibmF0YWxpYTA0IiwiYSI6ImNtM3E4MnFsNDBsMDAyanNhcmtxbzB5ZWEifQ.6cgByNf8BnyghepPNtdpMQ';
    
        const map = new mapboxgl.Map({
            container: 'mapa', // Selecciona el div con id "mapa" como contenedor
            style: 'mapbox://styles/mapbox/streets-v11', // Estilo del mapa
            center: [this.longitud, this.latitud], // Coordenadas del centro del mapa
            zoom: 15 // Nivel de zoom inicial
        });
    
        // Crear un marcador y agregarlo al mapa
        new mapboxgl.Marker()
            .setLngLat([this.longitud, this.latitud]) // Coordenadas del marcador
            .addTo(map);
    }
    

}

const viaje = new Viajes();