class Agenda{
    // constructor de la clase agenda
    constructor(){
        this.url = "http://ergast.com/api/f1/current.json";
    }

    /**
     * Metodo para obtener las carreras de la temporada
     */
    obtenerCarreras(){
        $.ajax({
            url: this.url,
            dataType: "json",
            success: (response) => {
                const carreras = response.MRData.RaceTable.Races;

                carreras.forEach((carrera) => {
                    const nombreCarrera = carrera.raceName;
                    const nombreCircuito = carrera.Circuit.circuitName;
                    const coordenadasLat = carrera.Circuit.Location.lat;
                    const coordenadasLong = carrera.Circuit.Location.long;
                    const fechaCarrera = new Date(carrera.date + " " + carrera.time).toLocaleDateString("es-ES", {
                        weekday: "long",
                        year: "numeric",
                        month: "numeric",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric"
                    });

                    const articulo = `
                        <article>
                            <h3>${nombreCarrera}</h3>
                            <p>Circuito: ${nombreCircuito} </p>
                            <p>Ubicacion: Latitud: ${coordenadasLat}, Longitud: ${coordenadasLong}</p>
                            <p>Fecha y hora: ${fechaCarrera}</p>
                        </article>
                    `;

                    $("main").append(articulo);
                });
            },

            error: (error) => {
                console.error("Error al obtener las carreras", error);
            }
        });
    }
}

var agenda = new Agenda();