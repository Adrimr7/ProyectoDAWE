import Producto from './producto.js';

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

export default Helicoptero;