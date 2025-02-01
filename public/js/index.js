import { productos, carrito, JetGrande, JetMediano, JetPequeno, Avioneta, Helicoptero } from './tienda.js';

// Variables globales
let productosFiltrados = [...productos];
const contenedorProductos = document.getElementById("jets-container");
const inputBuscador = document.getElementById("buscador");
const tituloProductos = document.getElementById("titulo-productos");
const paginacionDiv = document.getElementById("paginacion");

// Configuración inicial de la página
document.addEventListener("DOMContentLoaded", () => {
  renderPagina();
  actualizarCarrito();
});

function renderProductos(lista) {
    contenedorProductos.innerHTML = "";
    lista.forEach(prod => {
      let extra = "";
      if (prod instanceof JetGrande) {
        extra = `<p class="card-text"><strong>Tamaño:</strong> ${prod.num_pasajeros} m</p>`;
      } else if (prod instanceof JetMediano) {
        extra = `<p class="card-text"><strong>Alcance:</strong> ${prod.num_pasajeros} km</p>`;
      } else if (prod instanceof JetPequeno) {
        extra = `<p class="card-text"><strong>Pasajeros:</strong> ${prod.num_pasajeros}</p>`;
      } else if (prod instanceof Avioneta) {
        extra = `<p class="card-text"><strong>Tripulación:</strong> ${prod.alcance}</p>`;
      } else if (prod instanceof Helicoptero) {
        extra = `<p class="card-text"><strong>Facilidades:</strong> ${prod.facilidades.join(", ")}</p>`;
      }
      const card = `
        <div class="col-md-4 mb-3">
          <div class="card h-100">
            <img src="${prod.imagen}" class="card-img-top" alt="${prod.nombre}">
            <div class="card-body">
              <h5 class="card-title">${prod.nombre}</h5>
              <p class="card-text text-truncate">${prod.descripcion}</p>
              <p class="card-text"><strong>Precio:</strong> $${prod.precio.toLocaleString()}</p>
              ${extra}
            </div>
            <div class="card-footer text-end">
              <button class="btn btn-success agregar-carrito" data-id="${prod.id}">
                <i class="bi bi-cart"></i> Añadir al carrito
              </button>
            </div>
          </div>
        </div>
      `;
      contenedorProductos.innerHTML += card;
    });
  }

const productosPorPagina = 6;
let paginaActual = 1;

function renderPagina() {
  const totalPaginas = Math.ceil(productosFiltrados.length / productosPorPagina);
  const inicio = (paginaActual - 1) * productosPorPagina;
  const fin = inicio + productosPorPagina;
  const productosPagina = productosFiltrados.slice(inicio, fin);
  renderProductos(productosPagina);
  renderPaginacion(totalPaginas);
}

// Primera version
function renderPaginacion(totalPaginas) {
  paginacionDiv.innerHTML = "";
  if (paginaActual > 1) {
    paginacionDiv.innerHTML += `<button class="btn btn-secondary me-2" onclick="cambiarPagina(${paginaActual - 1})">Anterior</button>`;
  }
  for (let i = 1; i <= totalPaginas; i++) {
    paginacionDiv.innerHTML += `<button class="btn ${i === paginaActual ? "btn-primary" : "btn-outline-primary"} me-1" onclick="cambiarPagina(${i})">${i}</button>`;
  }
  if (paginaActual < totalPaginas) {
    paginacionDiv.innerHTML += `<button class="btn btn-secondary" onclick="cambiarPagina(${paginaActual + 1})">Siguiente</button>`;
  }
}

window.cambiarPagina = function(nuevaPagina) {
  paginaActual = nuevaPagina;
  renderPagina();
};
  
