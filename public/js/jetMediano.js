import Producto from './producto.js';

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

export default JetMediano;