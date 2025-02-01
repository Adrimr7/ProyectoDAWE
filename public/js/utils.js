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

export const IMAGEN_POR_DEFECTO = "imagenes/default.png";
