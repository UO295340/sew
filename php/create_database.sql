-- Crear la base de datos si no existe
CREATE DATABASE IF NOT EXISTS formula1;

-- Usar la base de datos
USE formula1;

-- Crear las tablas que vamos a utilizar
CREATE TABLE IF NOT EXISTS escuderias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL UNIQUE,
    base VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS pilotos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL UNIQUE,
    escuderia_id INT NOT NULL,
    nacionalidad VARCHAR(255) NOT NULL,
    fechaNac DATE NOT NULL,
    FOREIGN KEY (escuderia_id) REFERENCES escuderias(id)
);

CREATE TABLE IF NOT EXISTS circuitos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL UNIQUE,
    localizacion VARCHAR(255) NOT NULL,
    longitud FLOAT NOT NULL
);

CREATE TABLE IF NOT EXISTS carreras (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fecha DATE NOT NULL,
    circuito_id INT,
    ganador_id INT NOT NULL,
    FOREIGN KEY (circuito_id) REFERENCES circuitos(id),
    FOREIGN KEY (ganador_id) REFERENCES pilotos(id)
);

CREATE TABLE IF NOT EXISTS resultados (
    id INT AUTO_INCREMENT PRIMARY KEY,
    carrera_id INT NOT NULL,
    piloto_id INT NOT NULL,
    posicion INT NOT NULL,
    FOREIGN KEY (carrera_id) REFERENCES carreras(id),
    FOREIGN KEY (piloto_id) REFERENCES pilotos(id)
);