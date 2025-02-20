export function guidGenerator() {
    let S4 = () => (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    return `${S4()}${S4()}-${S4()}-${S4()}-${S4()}-${S4()}${S4()}${S4()}`;
}


export function actualizarCarrito(carrito) {
    const carritoElemento = document.getElementById("carrito");
    carritoElemento.innerHTML = "";
    let total = 0;

    for (const id in carrito) {
        if (carrito[id].cantidad <= 0) {
            delete carrito[id]; // Elimina el producto si su cantidad es 0
            continue; // Salta a la siguiente iteración
        }

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
                <input type="number" min="0" max="21" value="${cantidad}" class="form-control w-50 cantidad-input" data-id="${id}">
                <p>Total: $<span class="item-total">${precio * cantidad}</span></p>
                <small class="text-danger mensaje-max d-none">Máximo alcanzado</small>
            </div>
        `;

        carritoElemento.appendChild(div);
    }

    document.getElementById("total").textContent = total;

    // Agregar eventos a los inputs para detectar cambios en la cantidad
    document.querySelectorAll(".cantidad-input").forEach(input => {
        input.addEventListener("input", function () {
            const id = this.dataset.id;
            const cantidad = parseInt(this.value);
            const max = parseInt(this.max);
            const mensaje = this.parentElement.querySelector(".mensaje-max");

            if (cantidad >= max) {
                this.value = max;
                carrito[id].cantidad = max;
                setTimeout(() => 
                    mensaje.classList.add("d-none")
                , 2000);
                mensaje.classList.remove("d-none");
  
            } else if (cantidad === 0) {
                delete carrito[id]; // Elimina el producto si su cantidad es 0
                actualizarCarrito(carrito); // Refresca el carrito
            } else {
                carrito[id].cantidad = cantidad;
                actualizarCarrito(carrito);
            }
        });
    });
}


export const IMAGEN_POR_DEFECTO = "imagenes/default.png";
