import { actualizarCarrito } from "./utils.js";

document.addEventListener("DOMContentLoaded", () => {
    const carrito = {};
    // hay que probarlo habiendo cargado los productos
    document.querySelectorAll(".add-to-cart").forEach(button => {
        button.addEventListener("click", () => {
            const nombre = button.dataset.nombre;
            const precio = parseFloat(button.dataset.precio);
            const img = button.dataset.img;

            if (!carrito[nombre]) {
                carrito[nombre] = { precio, cantidad: 1, img };
            } 
            else {
                carrito[nombre].cantidad++;
            }

            actualizarCarrito(carrito);
        });
    });
});