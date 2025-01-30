import { guidGenerator, IMAGEN_POR_DEFECTO } from './utils.js';

//Superclase de la que hereda el resto.
class Producto {
    #id;
    #nombre;
    #precio;
    #descripcion;
    #imagen;

    constructor(nombre, precio, descripcion = "Sin descripción", imagen = null) {
        this.#id = guidGenerator();
        this.#nombre = nombre;
        this.#precio = precio;
        this.#descripcion = descripcion;
        this.#imagen = imagen || IMAGEN_POR_DEFECTO;
    }

    // Getters
    get id() {
        return this.#id;
    }

    get nombre() {
        return this.#nombre;
    }

    get precio() {
        return this.#precio;
    }

    get descripcion() {
        return this.#descripcion;
    }

    get imagen() {
        return this.#imagen;
    }

    // Setters
    set nombre(nombre) {
        this.#nombre = nombre;
    }

    set precio(precio) {
        this.#precio = precio;
    }

    set descripcion(descripcion) {
        this.#descripcion = descripcion;
    }

    set imagen(imagen) {
        this.#imagen = imagen || IMAGEN_POR_DEFECTO;
    }
}

//Subclases

class JetGrande extends Producto {
    #num_pasajeros;
    constructor(nombre, precio, descripcion, imagen, num_pasajeros) {
        super(nombre, precio, descripcion, imagen);
        this.#num_pasajeros = num_pasajeros;
    }
    get num_pasajeros() {
        return this.#num_pasajeros;
    }
    set num_pasajeros(num) {
        this.#num_pasajeros = num;
    }
}

class JetMediano extends Producto {
    #num_pasajeros;
    constructor(nombre, precio, descripcion, imagen, num_pasajeros) {
        super(nombre, precio, descripcion, imagen);
        this.#num_pasajeros = num_pasajeros;
    }
    get num_pasajeros() {
        return this.#num_pasajeros;
    }
    set num_pasajeros(num) {
        this.#num_pasajeros = num;
    }
}

class JetPequeno extends Producto {
    #num_pasajeros;
    constructor(nombre, precio, descripcion, imagen, num_pasajeros) {
        super(nombre, precio, descripcion, imagen);
        this.#num_pasajeros = num_pasajeros;
    }
    get num_pasajeros() {
        return this.#num_pasajeros;
    }
    set num_pasajeros(num) {
        this.#num_pasajeros = num;
    }
}

class Avioneta extends Producto {
    #alcance;
    constructor(nombre, precio, descripcion, imagen, alcance) {
        super(nombre, precio, descripcion, imagen);
        this.#alcance = alcance;
    }
    get alcance() {
        return this.#alcance;
    }
    set alcance(personal) {
        this.#alcance = personal;
    }
}

class Helicoptero extends Producto {
    #facilidades;
    constructor(nombre, precio, descripcion, imagen, facilidades = []) {
        super(nombre, precio, descripcion, imagen);
        this.#facilidades = facilidades;
    }
    get facilidades() {
        return this.#facilidades;
    }
    set facilidades(facilidades) {
        this.#facilidades = facilidades;
    }
}

const productos = [
    // todos los Jets tienen como parametro adicional el numero de pasajeros.
    // Jets Grandes. (constructora) +  Numero de pasajeros.
    new JetGrande("Gulfstream GIV-SP", 45000, "Modelo clásico dentro del rango máximo", "imagenes/jets/Gulfstream GIV-SP.jpg", 14),
    new JetGrande("Gulfstream G600", 55000, "Capacidad máxima y buena relacion calidad/precio", "imagenes/jets/Gulfstream G600.jpg", 18),
    new JetGrande("Gulfstream G650", 60000, "Jet de largo alcance y lujo", "imagenes/jets/Gulfstream G650.jpg", 19),
    new JetGrande("Gulfstream G700", 70000, "Jet de última generación", "imagenes/jets/Gulfstream G700.jpg", 20),
    new JetGrande("Bombardier Global 7500", 75000, "Jet intercontinental con máxima comodidad", "imagenes/jets/Bombardier Global 7500.jpg", 19),
    new JetGrande("Bombardier Global 8000", 80000, "Gama premium, intercontinental, moderno y de extra lujo", "imagenes/jets/Bombardier Global 8000.jpg", 22),

    // Jets Medianos. (constructora) +  Numero de pasajeros.
    new JetMediano("Gulfstream G500", 45000, "Jet ejecutivo de rango medio", "imagenes/jets/Gulfstream G650.jpg", 16),
    new JetMediano("Cessna Citation X+", 35000, "Jet mediano con gran velocidad", "imagenes/jets/Cessna Citation X+.jpg", 12),
    new JetMediano("Cessna Citation Longitude", 37000, "Gran alcance para su precio", "imagenes/jets/Cessna Citation Longitude.jpg", 12),
    new JetMediano("Embraer Legacy 500", 32000, "Jet con avanzada tecnología de cabina", "imagenes/jets/Embraer Legacy 500.jpg", 12),
    new JetMediano("Bombardier Challenger 350", 34000, "Alcance medio, perfecto para viajes ejecutivos", "imagenes/jets/Bombardier Challenger 350.jpg", 10),

    // Jets Pequeños. (constructora) +  Numero de pasajeros.
    new JetPequeno("Cessna Citation CJ4", 28000, "Mucha cantidad de pasajeros", "imagenes/jets/Cessna Citation CJ4.jpg", 10),
    new JetPequeno("Cessna Citation CJ3+", 28000, "Moderno y con muy buena eficiencia de combustible", "imagenes/jets/Cessna Citation CJ3+.jpg", 9),
    new JetPequeno("Cessna Citation M2", 18000, "Jet compacto y económico en mantenimiento y uso", "imagenes/jets/Cessna Citation M2.jpg", 6),
    new JetPequeno("Honda HondaJet Elite", 25000, "Jet pequeño con alta eficiencia", "imagenes/jets/Honda HondaJet Elite.jpg", 6),
    new JetPequeno("Bombardier Learjet 75 Liberty", 28000, "Jet compacto y rápido", "imagenes/jets/Bombardier Learjet 75 Liberty.jpg", 9),

    // Avionetas. (constructora) +  Alcance en KMs.
    new Avioneta("Cessna 172 Skyhawk", 5000, "Avioneta de entrenamiento y turismo", "imagenes/jets/Cessna 172 Skyhawk.jpg", 1289),
    new Avioneta("Piper PA-28 Cherokee", 5500, "Avioneta versátil para viajes cortos", "imagenes/jets/Piper PA-28 Cherokee.jpg", 1389),
    new Avioneta("Diamond DA40", 4000, "Avioneta ligera y eficiente", "imagenes/jets/Diamond DA40.jpg", 1350),
    new Avioneta("Beechcraft Bonanza G36", 6000, "Avioneta premium, para los más exigentes", "imagenes/jets/Beechcraft Bonanza G36jpg", 1482),
    new Avioneta("Mooney M20", 4500, "Avioneta con gran alcance para su precio", "imagenes/jets/Mooney M20.jpg", 1600),

    // Helicópteros. (constructora) +  Facilidades.
    new Helicoptero("Robinson R44", 4000, "Helicóptero ligero de entrenamiento", "imagenes/jets/Robinson R44.jpg", ["Wi-Fi"]),
    new Helicoptero("Bell 407", 7000, "Helicóptero de lujo con gran capacidad", "imagenes/jets/Bell 407.jpg", ["Wi-Fi", "Cámara profesional"]),
    new Helicoptero("AgustaWestland AW109", 12000, "Helicóptero de rescate y operaciones especiales", "imagenes/jets/AgustaWestland AW109.jpg", ["Wi-Fi"]),
    new Helicoptero("Sikorsky S-76", 15000, "Helicóptero para transporte de material pesado", "imagenes/jets/Sikorsky S-76.jpg", ["Wi-Fi"]),
    new Helicoptero("Airbus H125", 8000, "Helicóptero con alto rendimiento", "imagenes/jets/Airbus H125.jpg", ["Wi-Fi"])
];

//Lista para el carrito
const carrito = [];

export { productos, carrito };
