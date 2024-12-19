class Memoria {
    // constructor con los tarjetas
    constructor() {
        this.hasFlippedCard = false; // Indica si hay una carta dada la vuelta
        this.lockBoard = false;     // Indica si el tablero se encuentra bloqueado a la interaccion del usuario
        this.firstCard = null;      // Indica cual es la primera carta a la que se ha dado la vuelta en esta interaccion
        this.secondCard = null;     // Indica cual es la segunda carta a la que se ha dado la vuelta en esta interaccion
        this.matches = 0;           // Se utiliza para saber si se ha compeltado el juego
        this.startTime = null;      // Tiempo en que comienza el juego
        this.timeStarted = false;   // Indica si el temporizador ha iniciado

        // Objeto JSON con los elementos duplicados para representar las 12 cartas
        this.elements = [
            { "element": "RedBull", "source": "https://upload.wikimedia.org/wikipedia/de/c/c4/Red_Bull_Racing_logo.svg" },
            { "element": "RedBull", "source": "https://upload.wikimedia.org/wikipedia/de/c/c4/Red_Bull_Racing_logo.svg" },
            { "element": "McLaren", "source": "https://upload.wikimedia.org/wikipedia/en/6/66/McLaren_Racing_logo.svg" },
            { "element": "McLaren", "source": "https://upload.wikimedia.org/wikipedia/en/6/66/McLaren_Racing_logo.svg" },
            { "element": "Alpine", "source": "https://upload.wikimedia.org/wikipedia/fr/b/b7/Alpine_F1_Team_2021_Logo.svg" },
            { "element": "Alpine", "source": "https://upload.wikimedia.org/wikipedia/fr/b/b7/Alpine_F1_Team_2021_Logo.svg" },
            { "element": "AstonMartin", "source": "https://upload.wikimedia.org/wikipedia/fr/7/72/Aston_Martin_Aramco_Cognizant_F1.svg" },
            { "element": "AstonMartin", "source": "https://upload.wikimedia.org/wikipedia/fr/7/72/Aston_Martin_Aramco_Cognizant_F1.svg" },
            { "element": "Ferrari", "source": "https://upload.wikimedia.org/wikipedia/de/c/c0/Scuderia_Ferrari_Logo.svg" },
            { "element": "Ferrari", "source": "https://upload.wikimedia.org/wikipedia/de/c/c0/Scuderia_Ferrari_Logo.svg" },
            { "element": "Mercedes", "source": "https://upload.wikimedia.org/wikipedia/commons/f/fb/Mercedes_AMG_Petronas_F1_Logo.svg" },
            { "element": "Mercedes", "source": "https://upload.wikimedia.org/wikipedia/commons/f/fb/Mercedes_AMG_Petronas_F1_Logo.svg" }
        ];

        this.shuffleElements();
        this.createElements();
        this.addEventListener();
    }

    /**
     *  Este metodo coge el objeto JSON y baraja los elementos, para que las tarjetas
     * esten en un orden distinto en cada partida
     */
    shuffleElements() {
        for (let i = this.elements.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.elements[i], this.elements[j]] = [this.elements[j], this.elements[i]]; // Intercambio
        }
    }

    /**
     * Este metodo bloquea el tablero en primer lugar y luego voltea las cartas que estan
     * bocarriba y resetea el tablero
     */
    unflipCards(){
        // 1. bloqueamos el tablero
        this.lockBoard = true;

        // 2. introducimos un pequeno retraso antes de voltear
        setTimeout(() =>{
            this.firstCard.removeAttribute('data-state');
            this.secondCard.removeAttribute('data-state');
            // Damos la vuelta a las cartas
            this.firstCard = null;
            this.secondCard = null;

            // Indicamos que no hay cartas bocarriba
            this.hasFlippedCard = false;

            // Desbloqueamos el tablero
            this.lockBoard = false;

        }, 500);
    }

    /**
     * Reseteamos el tablero:
     * - Ponemos a null las cartas
     * - Ponemso a false las variables del tablero
     */
    resetBoard(){
        this.firstCard = null;
        this.secondCard = null;
        this.hasFlippedCard = false;
        this.lockBoard = false;
    }

    /**
     * Comprueba si las cartas volteadas son iguales
     * Si lo son llama al metodo disableCards; sino llama al metodo unflipCards
     */
    checkForMatch(){
        this.firstCard.getAttribute('data-element') === this.secondCard.getAttribute('data-element')
        ? this.disableCards()
        : this.unflipCards();
    }

    /**
     * Este metodo deshabilita las interacciones sobre las tarjetas de memoria que
     * ya han sido emparejadas. 
     */
    disableCards(){
        this.firstCard.datastate = "revealed";
        this.secondCard.datastate = "revealed";
        this.matches++;

        if(this.matches == this.elements.length/2){
            this.showVictoryMessage();
        }

        this.resetBoard();
    }

    showVictoryMessage(){
        const main = document.querySelector('main > article');
        const p = document.createElement('p');

        const elepsedTime = Date.now() - this.startTime;
        const seconds = Math.floor((elepsedTime / 1000));

        p.innerHTML = `<p>¡Felicidades! Has completado el juego en ${seconds} segundos.`
        main.appendChild(p);
    }

    /**
     * Recorre el objeto JSON y crea, por cada uno de los elementos, un nodo article 
     * en el documento hmtl para representar cada tarjeta del juego de memoria
     */
    createElements(){
        const container = document.querySelector('section');

        this.shuffleElements();
        
        this.elements.forEach(element => {
            const article = document.createElement('article');
            article.setAttribute('data-element', element.element);

            const h3 = document.createElement('h3');
            h3.innerHTML = `Tarjeta de Memoria`;

            const img = document.createElement('img');
            img.src = element.source;
            img.alt = element.element;

            //const header = document.createElement('header');
            //header.innerHTML = `
            //    <h3>Tarjeta de Memoria</h3>
            //    <img src="${element.source}" alt="${element.element}"
            //`;

            article.appendChild(h3);
            article.appendChild(img);
            container.appendChild(article);
        })

        this.addEventListener();
    }

    /**
     * Anade un eventListener a todas las tarjetas creadas
     * Cuando se haya seleccionado una tarjeta se llamara al metodo flipCard
     */
    addEventListener(){
        this.cards = document.querySelectorAll('article');
        this.cards.forEach(card => {
            card.onclick = this.flipCard.bind(this, card);
        });
    }

    /**
     * Metodo que se ejecutara una vez se seleccione una carta
     * @param {} game 
     */
    flipCard(game){
        if(game.getAttribute('data-state') === 'revealed'){
            return;
        }

        // Inicia el temporizador
        if(!this.timeStarted){
            this.startTime = Date.now();
            this.timeStarted = true;
        }

        if(this.lockBoard){
            return;
        }

        if(game === this.firstCard){
            return;
        }

        game.setAttribute('data-state', 'flip');

        if(!this.hasFlippedCard){
            this.hasFlippedCard = true;
            this.firstCard = game;
            return;
        }

        this.secondCard = game;

        this.checkForMatch();

    }

    mostrarAyuda() {
        const section = document.querySelector('aside');
        
        // Crear un nuevo artículo para el modal
        const modalContent = document.createElement('article');
        
        // Crear el contenido del modal
        const content = `
        <h2>Instrucciones del Juego</h2>
            <p>En este juego de memoria, el objetivo es encontrar todas las parejas de cartas que coincidan.</p>
            <p>Al comenzar el juego, verás un conjunto de cartas boca abajo. Haz clic en dos cartas para voltearlas.</p>
            <p>Si las cartas que seleccionaste coinciden, permanecerán boca arriba. Si no coinciden, se volverán a voltear después de un breve retraso.</p>
            <p>El juego continuará hasta que todas las cartas estén emparejadas correctamente.</p>
            <p>¡Intenta recordar las posiciones de las cartas para encontrar las parejas lo más rápido posible!</p>
            <button>Cerrar</button>
        `;

        // Insertamos el contenido dentro del artículo (modal)
        modalContent.innerHTML = content;
        
        // Insertamos el artículo en el section
        section.appendChild(modalContent);
    
        // Mostrar el modal cambiando el atributo 'data-state'
        section.setAttribute('data-state', 'visible');
        
        // Obtener el botón de cierre y agregar el evento para cerrarlo
        const closeButton = modalContent.querySelector('button');
        closeButton.onclick = () => {
            section.removeAttribute('data-state'); // Eliminar el atributo para ocultar el modal
            section.removeChild(modalContent);     // Eliminar el artículo (modal) del DOM
        };
    }   
    
    mostrarTutorial() {
        const section = document.querySelector('aside');
        
        // Crear un nuevo artículo para el modal
        const video = document.createElement('article');
        
        // Crear el contenido del modal
        const content = `
        <h2>Video Tutorial</h2>
            <video controls preload="auto">
                <source src="multimedia/videos/Tutorial.mp4"
                    type="video/mp4" />
                <source src="multimedia/videos/Tutorial.webm" 
                    type="video/webm" />
            </video>
        <button>Cerrar</button>
        `;

        // Insertamos el contenido dentro del artículo (modal)
        video.innerHTML = content;
        
        // Insertamos el artículo en el section
        section.appendChild(video);
    
        // Mostrar el modal cambiando el atributo 'data-state'
        section.setAttribute('data-state', 'visible');
        
        // Obtener el botón de cierre y agregar el evento para cerrarlo
        const closeButton = video.querySelector('button');
        closeButton.onclick = () => {
            section.removeAttribute('data-state'); // Eliminar el atributo para ocultar el modal
            section.removeChild(video);     // Eliminar el artículo (modal) del DOM
        };
    }  
    
    resetGame() {
        // 1. Reiniciar propiedades relacionadas con el tiempo
        this.startTime = null;
        this.timeStarted = false;
        clearInterval(this.timerInterval);

        // 2. Reiniciar el estado de las cartas
        this.firstCard = null;
        this.secondCard = null;
        this.hasFlippedCard = false;
        this.lockBoard = false;
        this.matches = 0;

        // 3. Limpiar el tablero
        const container = document.querySelector('section');
        while (container.firstChild) {
            container.removeChild(container.firstChild); // Eliminar todas las cartas
        }

        // 4. Barajar y recrear las cartas
        this.shuffleElements();
        this.createElements();
        this.addEventListener();

        // 5. Eliminar mensajes de victoria o temporales
        const main = document.querySelector('main > article');
        while (main.firstChild) {
            main.removeChild(main.firstChild); // Eliminar mensajes adicionales
        }

    }
    
}