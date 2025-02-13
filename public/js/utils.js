export function guidGenerator() {
    let S4 = () => (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    return `${S4()}${S4()}-${S4()}-${S4()}-${S4()}-${S4()}${S4()}${S4()}`;
}


export function actualizarCarrito(carrito) {
    const carritoElemento = document.getElementById("carrito");
    carritoElemento.innerHTML = "";
    let total = 0;

    for (const id in carrito) {
        const { nombre, precio, cantidad, img } = carrito[id];
        total += precio * cantidad;

        const div = document.createElement("div");
        div.classList.add("d-flex", "align-items-center", "mb-3");
        div.innerHTML = 
        `
            <img src="${img}" width="50" class="me-3">
            <div>
                <h6>${nombre}</h6>
                <p>$${precio} c/u</p>
                <input type="number" min="1" max="20" value="${cantidad}" class="form-control w-50" data-id="${id}">
                <p>Total: $<span class="item-total">${precio * cantidad}</span></p>
            </div>
        `;
        carritoElemento.appendChild(div);
    }

    document.getElementById("total").textContent = total;
}

export const IMAGEN_POR_DEFECTO = "imagenes/default.png";
