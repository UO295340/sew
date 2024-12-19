class Noticias {
    // Constructor que comprueba si el navegador que está usando el usuario 
    // soporta el uso de la API File
    constructor() {
        if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
            document.write("<p>¡¡¡ Este navegador NO soporta el API File y este programa puede no funcionar correctamente !!!</p>");
        }
    }

    // Metodo que realiza la lectura del fichero noticias.txt
    readInputFile(files) {
        const archivo = files[0];

        if (archivo) {
            const reader = new FileReader();

            reader.onload = function (e) {
                const content = e.target.result;
                const lines = content.split("\n");

                lines.forEach((line, index) => {
                    if (line.trim()) {
                        const [title, subtitle, author] = line.split('_');

                        const article = document.createElement('article');
                        article.innerHTML = `
                            <h2>${title}</h2>
                            <p>${subtitle}</p>
                            <p>Escrito por: ${author}</p>
                        `;

                        document.querySelector('section').appendChild(article);
                    }

                });


            };

            reader.readAsText(archivo);
        }
    }

    // Metodo para añadir noticias manualemnte
    addManualNews() {
        const title = document.getElementById('titulo').value.trim();
        const subtitle = document.getElementById('subtitle').value.trim();
        const author = document.getElementById('author').value.trim();

        if (title && subtitle && author) {
            const article = document.createElement('article');
            article.innerHTML = `
                <h2>${title}</h2>
                <p>${subtitle}</p>
                <p>Escrito por: ${author}</p>
            `;

            document.querySelector('section').appendChild(article);

            document.getElementById('nuevaNoticiaForm').reset();
        } else{
            alert("Por favor rellena todos los campos antes de añadir la noticia.");
        }

    }
}

const noticias = new Noticias();