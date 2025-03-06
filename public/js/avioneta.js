import Producto from './Producto.js';

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

export default Avioneta;