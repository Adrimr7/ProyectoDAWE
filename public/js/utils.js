export function guidGenerator() {
    let S4 = () => (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    return `${S4()}${S4()}-${S4()}-${S4()}-${S4()}-${S4()}${S4()}${S4()}`;
}

export function actualizarTitulo() {
    let input = document.getElementById("buscador").value.trim();
    let titulo = document.getElementById("titulo");

    if (input === "") {
        titulo.textContent = "Todos los productos";
    } else {
        titulo.textContent = `Buscando por: ${input}`;
    }
}

export function actualizarCarrito(carrito) {
    // falta probar con datos
    const carritoElemento = document.getElementById("carrito");
    carritoElemento.innerHTML = "";
    let total = 0;

    for (const item in carrito) {
        const { precio, cantidad, img } = carrito[item];
        total += precio * cantidad;

        const div = document.createElement("div");
        div.classList.add("d-flex", "align-items-center", "mb-3");
        div.innerHTML = 
        `
            <img src="${img}" width="50" class="me-3">
            <div>
                <h6>${item}</h6>
                <p>$${precio} c/u</p>
                <input type="number" min="1" value="${cantidad}" class="form-control w-50" data-name="${item}">
                <p>Total: $<span class="item-total">${precio * cantidad}</span></p>
            </div>
        `;
        carritoElemento.appendChild(div);
    }

    document.getElementById("total").textContent = total;
}

export const IMAGEN_POR_DEFECTO = "imagenes/default.png";
