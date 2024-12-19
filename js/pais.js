class Pais {
    // constructor con algunos atributos
    constructor(nombrePais, nombreCapital, poblacion) {
        this.nombrePais = nombrePais;
        this.nombreCapital = nombreCapital;
        this.nombreCircuito = null;
        this.poblacion = poblacion;
        this.formaGobierno = null;
        this.coordenadas = null;
        this.religion = null;
    }

    // funcion que rellena los datos que faltaban
    rellenarOtrosDatos(nombreCircuito, formaGobierno, coordenadasLat, coordenadasLong, coordenadasAlt, religion) {
        this.nombreCircuito = nombreCircuito;
        this.formaGobierno = formaGobierno;
        this.coordenadasLat = coordenadasLat;
        this.coordenadasLong = coordenadasLong;
        this.coordenadasAlt = coordenadasAlt;
        this.religion = religion;
    }

    // funcion que obtiene el pais
    obtenerPais() {
        return `Nombre del país: ${this.nombrePais}`;
    }

    // funcion que obtiene la capital
    obtenerCapital() {
        return `Nombre de la capital: ${this.nombreCapital}`;
    }

    // funcion que obtiene la info secundaria en forma de lista
    obtenerInformacionSecundaria() {
        return `<ul>
                    <li> Población: ${this.poblacion}</li>
                    <li> Nombre circuito: ${this.nombreCircuito}</li>
                    <li> Forma de gobierno: ${this.formaGobierno}</li>
                    <li> Religión mayoritaria: ${this.religion}</li>
                </ul>`
    }

    // escribe en el documento la info de las coordenadas de la linea de meta
    escribirCoordenadas() {
        document.write(`<p>Coordenadas dde la línea de meta del circuito: ${this.coordenadasLat}, ${this.coordenadasLong}, ${this.coordenadasAlt}</p>`);
    }

    obtenerPrevisionTiempo() {
        const apiKey = "9043bcd65b1ce02b05ed18135d78625f";
        const url = "https://api.openweathermap.org/data/2.5/forecast";
    
        $.ajax({
            url: url,
            dataType: "json", // Solicitar el formato JSON
            data: {
                lat: this.coordenadasLat, // Latitud del circuito
                lon: this.coordenadasLong, // Longitud del circuito
                appid: apiKey,
                lang: "es",
                units: "metric",
            },
            success: function (response) {
                // Procesar la respuesta JSON
                const dias = agruparPorDia(response.list);
    
                // Iterar sobre los días y añadirlos al DOM
                dias.forEach((dia) => {
                    const article = `
                        <article>
                            <h2>Pronóstico para ${dia.fecha}</h2>
                            <img src="https://openweathermap.org/img/wn/${dia.icono}.png" alt="${dia.descripcion}" />
                            <p>Temperatura máxima: ${dia.temperaturaMax}°C</p>
                            <p>Temperatura mínima: ${dia.temperaturaMin}°C</p>
                            <p>Humedad: ${dia.humedad}%</p>
                            <p>Lluvia: ${dia.lluvia ? dia.lluvia + " mm" : "Sin precipitaciones"}</p>
                        </article>
                    `;
                    $("section").append(article); // Añadir el contenido a section
                });
            },
            error: function (error) {
                console.error("Error al obtener la previsión meteorológica:", error);
            },
        });
    
        /**
         * Agrupa las previsiones meteorológicas por día.
         */
        function agruparPorDia(lista) {
            const dias = {};
    
            lista.forEach((item) => {
                const fechaCompleta = item.dt_txt.split(" ")[0]; // Extraer la fecha (AAAA-MM-DD)
                const hora = item.dt_txt.split(" ")[1]; // Hora (HH:mm:ss)
                const temperatura = item.main.temp;
                const humedad = item.main.humidity;
                const icono = item.weather[0].icon;
                const descripcion = item.weather[0].description;
                const lluvia = item.rain ? item.rain["3h"] || 0 : 0;
    
                // Convertir la fecha a "día/mes/año"
                const fechaObj = new Date(fechaCompleta);
                const dia = fechaObj.getDate().toString().padStart(2, '0'); // Día con 2 dígitos
                const mes = (fechaObj.getMonth() + 1).toString().padStart(2, '0'); // Mes con 2 dígitos
                const año = fechaObj.getFullYear(); // Año
    
                const fechaFormateada = `${dia}/${mes}/${año}`; // Formato "día/mes/año"
    
                if (!dias[fechaFormateada]) {
                    dias[fechaFormateada] = {
                        fecha: fechaFormateada,
                        temperaturaMax: temperatura,
                        temperaturaMin: temperatura,
                        humedad: humedad,
                        icono: icono,
                        descripcion: descripcion,
                        lluvia: lluvia,
                    };
                } else {
                    dias[fechaFormateada].temperaturaMax = Math.max(dias[fechaFormateada].temperaturaMax, temperatura);
                    dias[fechaFormateada].temperaturaMin = Math.min(dias[fechaFormateada].temperaturaMin, temperatura);
                    dias[fechaFormateada].lluvia += lluvia;
                }
            });
    
            return Object.values(dias).slice(0, 5); // Devuelve los próximos 5 días
        }
    }
    



}