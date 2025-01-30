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
    #tamano_m;
    constructor(nombre, precio, descripcion, imagen, tamano_m) {
        super(nombre, precio, descripcion, imagen);
        this.#tamano_m = tamano_m;
    }
    get tamano_m() {
        return this.#tamano_m;
    }
    set tamano_m(tamano) {
        this.#tamano_m = tamano;
    }
}

class JetMediano extends Producto {
    #alcance_km;
    constructor(nombre, precio, descripcion, imagen, alcance_km) {
        super(nombre, precio, descripcion, imagen);
        this.#alcance_km = alcance_km;
    }
    get alcance_km() {
        return this.#alcance_km;
    }
    set alcance_km(alcance) {
        this.#alcance_km = alcance;
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
    #personal_cabina;
    constructor(nombre, precio, descripcion, imagen, personal_cabina) {
        super(nombre, precio, descripcion, imagen);
        this.#personal_cabina = personal_cabina;
    }
    get personal_cabina() {
        return this.#personal_cabina;
    }
    set personal_cabina(personal) {
        this.#personal_cabina = personal;
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
    //Jets Grandes
    new JetGrande("Gulfstream G650", 55000, "Jet de largo alcance y lujo", "imagenes/jets/G650.jpg", 30),
    new JetGrande("Gulfstream G700", 70000, "Jet de última generación", "imagenes/jets/G700.jpg", 33),
    new JetGrande("Bombardier Global 7500", 75000, "Jet intercontinental con máxima comodidad", "imagenes/jets/Global7500.jpg", 34),

    //Jets Medianos
    new JetMediano("Gulfstream G500", 45000, "Jet ejecutivo de rango medio", "imagenes/jets/G500.jpg", 9630),
    new JetMediano("Cessna Citation X+", 35000, "Jet mediano con gran velocidad", "imagenes/jets/CitationX.jpg", 5956),
    new JetMediano("Embraer Legacy 500", 32000, "Jet con avanzada tecnología de cabina", "imagenes/jets/Legacy500.jpg", 5744),

    //Jets Pequeños
    new JetPequeno("Cessna Citation CJ4", 28000, "Jet ligero con gran versatilidad", "imagenes/jets/CJ4.jpg", 10),
    new JetPequeno("Honda HondaJet Elite", 25000, "Jet pequeño con alta eficiencia", "imagenes/jets/HondaJetElite.jpg", 6),
    new JetPequeno("Bombardier Learjet 75 Liberty", 28000, "Jet compacto y rápido", "imagenes/jets/Learjet75.jpg", 9),

    //Avionetas
    new Avioneta("Cessna 172 Skyhawk", 5000, "Avioneta de entrenamiento y turismo", "imagenes/jets/C172.jpg", 0),
    new Avioneta("Piper PA-28 Cherokee", 5500, "Avioneta versátil para viajes cortos", "imagenes/jets/PA28.jpg", 0),
    new Avioneta("Diamond DA40", 4000, "Avioneta ligera y eficiente", "imagenes/jets/DA40.jpg", 0),

    //Helicópteros
    new Helicoptero("Robinson R44", 4000, "Helicóptero ligero de entrenamiento", "imagenes/jets/R44.jpg", ["Wi-Fi"]),
    new Helicoptero("Bell 407", 7000, "Helicóptero de lujo con gran capacidad", "imagenes/jets/Bell407.jpg", ["Wi-Fi"]),
    new Helicoptero("Airbus H125", 8000, "Helicóptero con alto rendimiento", "imagenes/jets/H125.jpg", ["Wi-Fi"])
];

//Lista para el carrito
const carrito = [];

export { productos, carrito };
