class Fondo{
    // Constructor con 3 parametros
    constructor(nombrePais, nombreCapital, nombreCircuito){
        this.nombrePais = nombrePais;
        this.nombreCapital = nombreCapital;
        this.nombreCircuito = nombreCircuito;
    }

    obtenerImagenCircuito(){
        const apiKey = "aee626b7aebf766aeabd8cf240ab4c0f";
        const url = "https://www.flickr.com/services/rest/"

        $.ajax({
            url: url,
            dataType: "json",
            data: {
                method: "flickr.photos.search", // Método de la API
                api_key: apiKey,
                text: `${this.nombrePais} ${this.nombreCircuito} F1 race`, // Búsqueda específica
                format: "json", // Respuesta en JSON
                nojsoncallback: 1, // Evitar callback innecesario
                per_page: 1, // Obtener solo una imagen
                sort: "relevance", // Ordenar por relevancia
            },
            success: function(response){
                if(response.photos && response.photos.photo.length > 0){
                    const foto = response.photos.photo[0];
                    const urlFoto = `https://live.staticflickr.com/${foto.server}/${foto.id}_${foto.secret}_b.jpg`;
                    $("body").css({
                        "background-image": `url(${urlFoto})`,
                        "background-size": "cover", // Ajustar la imagen al tamaño de la pantalla
                        "background-position": "center", // Centrar la imagen
                        "background-repeat": "no-repeat", // Evitar repeticiones
                    });

                } else {
                    console.log("No se encontraron imágenes para el circuito.");
                }
            },
            error: function (error) {
                console.error("Error al realizar la consulta a Flickr:", error);
            },
        });
    }
}