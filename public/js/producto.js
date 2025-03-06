import { guidGenerator, IMAGEN_POR_DEFECTO } from './utils.js';

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

export default Producto;