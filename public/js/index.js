import { productos, carrito, JetGrande, JetMediano, JetPequeno, Avioneta, Helicoptero } from './tienda.js';
import { actualizarCarrito, actualizarTituloYProductos } from './utils.js';

// Variables globales
let productosFiltrados = [...productos];
const contenedorProductos = document.getElementById("jets-container");
const paginacionDiv = document.getElementById("paginacion");

// Configuración inicial de la página
document.addEventListener("DOMContentLoaded", () => {
  const titulo = document.querySelector("#titulo");
  const buscador = document.querySelector("#buscador");
  const tipoJet = document.querySelector('#tipoJet');
  const extraInput = document.querySelector('#extra');
  const dropZoneInput = document.getElementById('dropZone');
  renderPagina();
  actualizarCarrito();
  actualizarTituloYProductos(buscador, titulo);

  tipoJet.value = 'Jet Grande';
  tipoJet.dispatchEvent(new Event('change'));
  
  tipoJet.addEventListener('change', () => {
    switch (tipoJet.value) {
      case 'Jet Grande':
      case 'Jet Mediano':
      case 'Jet Pequeño':
        extraInput.placeholder = 'Número de pasajeros';
        break;
      case 'Avioneta':
        extraInput.placeholder = 'Alcance en kilómetros';
        break;
      case 'Helicóptero':
        extraInput.placeholder = 'Facilidades (separadas por comas)';
        break;
      default:
        extraInput.placeholder = 'Atributo extra (cambia dependiendo del tipo)';
        break;
    }
  });

});



function renderProductos(lista) {
    contenedorProductos.innerHTML = "";
    lista.forEach(prod => {
      let extra = "";
      if (prod instanceof JetGrande) {
        extra = `<p class="card-text"><strong>Pasajeros:</strong> ${prod.num_pasajeros} pax</p>`;
      } else if (prod instanceof JetMediano) {
        extra = `<p class="card-text"><strong>Pasajeros:</strong> ${prod.num_pasajeros} pax</p>`;
      } else if (prod instanceof JetPequeno) {
        extra = `<p class="card-text"><strong>Pasajeros:</strong> ${prod.num_pasajeros} pax</p>`;
      } else if (prod instanceof Avioneta) {
        extra = `<p class="card-text"><strong>Alcance:</strong> ${prod.alcance} km</p>`;
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

// Primera version (sin probar)
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

const formJet = document.getElementById("formulario-jet");
formJet.addEventListener("submit", (e) => {
  e.preventDefault();

  // Atributos base
  const tipo = document.getElementById("tipoJet").value;
  const nombre = document.getElementById("nombre").value;
  const precio = parseFloat(document.getElementById("precio").value);
  const descripcion = document.getElementById("descripcion").value;
  const imagenInput = document.getElementById("dropZone").files[0];
  let imagenUrl = imagenInput ? URL.createObjectURL(imagenInput) : null;

  const extraValue = document.getElementById("extra").value;
  
  if (!tipo || !nombre || isNaN(precio) || !extraValue) {
    alert("Por favor, rellena todos los campos obligatorios.");
    return;
  }
  
  let nuevoProducto;
   // Para los jets el extra es el número de pasajeros (se espera un número)
   if (tipo === "Jet Grande" || tipo === "Jet Mediano" || tipo === "Jet Pequeño") {
    const numPasajeros = parseInt(extraValue);
    if (isNaN(numPasajeros)) {
      alert("Por favor, ingresa un número válido para el número de pasajeros.");
      return;
    }
    if (tipo === "Jet Grande") {
      nuevoProducto = new JetGrande(nombre, precio, descripcion, imagenUrl, numPasajeros);
    } else if (tipo === "Jet Mediano") {
      nuevoProducto = new JetMediano(nombre, precio, descripcion, imagenUrl, numPasajeros);
    } else if (tipo === "Jet Pequeño") {
      nuevoProducto = new JetPequeno(nombre, precio, descripcion, imagenUrl, numPasajeros);
    }
  }
  // Para las avionetas el extra es el alcance en kilómetros (se espera un número)
  else if (tipo === "Avioneta") {
    const alcanceKm = parseFloat(extraValue);
    if (isNaN(alcanceKm)) {
      alert("Por favor, ingresa un número válido para el alcance en km.");
      return;
    }
    nuevoProducto = new Avioneta(nombre, precio, descripcion, imagenUrl, alcanceKm);
  }
  // Para los helicópteros el extra es la lista de facilidades (se ingresan separadas por comas)
  else if (tipo === "Helicóptero") {
    const facilidades = extraValue.split(",").map(f => f.trim()).filter(f => f !== "");
    if (facilidades.length === 0) {
      alert("Por favor, ingresa al menos una facilidad.");
      return;
    }
    nuevoProducto = new Helicoptero(nombre, precio, descripcion, imagenUrl, facilidades);
  }
  else {
    alert("Tipo de producto no válido");
    return;
  }
  
  // Agregar el nuevo producto a la lista global
  productos.push(nuevoProducto);
  productosFiltrados = [...productos];
  paginaActual = 1;
  renderPagina();
  alert("Producto agregado con éxito");
  formJet.reset();
});

  
dropZone.addEventListener('dragover', (event) => {
  event.preventDefault();
  dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', () => {
  dropZone.classList.remove('dragover');
});

dropZone.addEventListener('drop', (event) => {
  event.preventDefault();
  dropZone.classList.remove('dragover');

  const files = event.dataTransfer.files;
  if (files.length > 0) {
    dropZoneInput.value = files;
    const file = files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      dropZone.style.backgroundImage = `url(${e.target.result})`;
      dropZone.style.backgroundSize = 'cover';
      dropZone.style.backgroundPosition = 'center';
    };
    reader.readAsDataURL(file);
  }
});