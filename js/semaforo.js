class Semaforo {
    constructor() {
        this.levels = [0.2, 0.5, 0.8];  // Array de numeros que representan los niveles de dificulad

        this.difficulty = Math.floor(Math.random() * this.levels.length);
        this.lights = 4;                // Numero de luces del semaforo
        this.unload_moment = null;      // Momento en el que se inicia la secuencia de apagado del semaforo
        this.clic_moment = null;        // Momento en el que el usuario pulsa el boton

        this.createStructure();
    }

    /**
     * Crea en el documento HTML las luces del semaforo y el resto 
     * de elementos que se utilizara en el juego
     */
    createStructure() {
        const main = document.querySelector('main');    // Selecciona la etiqueta donde se va a añadir

        // Encabezado del juego
        const title = document.createElement('h2');
        title.innerHTML = `Semáforo`;
        main.appendChild(title);

        // Luces del juego
        const lightContainer = document.createElement('div');
        for (let i = 0; i < this.lights; i++) {
            const light = document.createElement('div');
            lightContainer.appendChild(light);
        }
        main.appendChild(lightContainer);

        // Contenedor de botones
        const buttonContainer = document.createElement('section');
        main.appendChild(buttonContainer);
        // Boton para arrancar
        const startButton = document.createElement('button');
        startButton.textContent = 'Arranque';
        startButton.onclick = () => {
            startButton.disabled = true;
            this.initSequence();
        }
        buttonContainer.appendChild(startButton);

        // Boton de reaccion
        const reactionButton = document.createElement('button');
        reactionButton.textContent = 'Reacción';
        reactionButton.disabled = true;
        reactionButton.onclick = () => {
            this.stopReaction();
        }
        buttonContainer.appendChild(reactionButton);
    }

    initSequence() {
        const main = document.querySelector('main');
        main.classList.add('load');

        const randomTimeout = Math.floor(Math.random() * (this.difficulty * 10) + 2000);

        setTimeout(() => {
            this.unload_moment = new Date();

            this.endSequence();
        }, randomTimeout);

    }

    endSequence() {
        const main = document.querySelector('main');
        main.classList.add('unload');

        const reactionButton = document.querySelector('button:nth-of-type(2)');
        reactionButton.disabled = false;
    }

    stopReaction() {
        // 1. Creamos una variable con la fecha actual
        // Cambiar
        this.clic_moment = new Date();
        // 2. Calculamos la diferencia entre los tiempos
        const tiempo = this.clic_moment - this.unload_moment;
        // 3. Mostramos al usuario
        const main = document.querySelector('main');
        const showResult = document.createElement('p');
        showResult.textContent = `Tu tiempo de reacción ha sido de ${tiempo} ms`;
        main.appendChild(showResult);
        // 4. Quitar las clases load y unload
        main.classList.remove('load', 'unload');
        // 5. Habilitar arranque y deshabilitar reaccion
        const startButton = document.querySelector('button:first-of-type');
        const reactionButton = document.querySelector('button:nth-of-type(2)');

        startButton.disabled = false;       // Habilitamos
        reactionButton.disabled = true;     // Deshabilitamos

        this.createRecordForm(tiempo);
    }

    createRecordForm(tiempo) {
        const main = document.querySelector('main');

        const form = document.createElement("form");
        form.id = "recordForm";
        form.method = "POST";
        form.action = "semaforo.php";

        form.innerHTML = `
                <h3>Registro de Resultado</h3>
                <label for="nombre">Nombre:</label>
                <input type="text" id="nombre" name="nombre" requiered /><br>
                
                <label for="apellidos">Apellidos:</label>
                <input type="text" id="apellidos" name="apellidos" requiered /><br>
                
                <label for="nivel">Nivel:</label>
                <input type="text" id="nivel" name="nivel" value="${this.levels[this.difficulty]}" readonly /><br>
                
                <label for="tiempo">Tiempo de reacción (ms): </label>
                <input type="text" id="tiempo" name="tiempo" value="${tiempo}" readonly /><br>

                <button type="submit"> Guardar </button>
                `
        main.appendChild(form);
    }
}