import { productos, JetGrande, JetMediano, JetPequeno, Avioneta, Helicoptero } from './tienda.js';
import { actualizarCarrito } from './utils.js';

// Variables globales
let productosFiltrados = [...productos];
const contenedorProductos = document.getElementById("jets-container");
const paginacionDiv = document.getElementById("paginacion");
let filtroTipo = null;
const productosPorPagina = 6;
let paginaActual = 1;
const carrito = {};
let filtroPrecio = 100000000;

// Configuración inicial de la página
document.addEventListener("DOMContentLoaded", () => {
  const titulo = document.querySelector("#titulo");
  const buscador = document.querySelector("#buscador");
  const tipoJet = document.querySelector('#tipoJet');
  const extraInput = document.querySelector('#extra');
  const dropZoneInput = document.querySelector('#dropZone');
  const selectorImagen = document.querySelector('#imagenJet');

  renderPagina();
  actualizarCarrito(carrito);
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

  dropZoneInput.addEventListener("dragenter", dragOver);
  dropZoneInput.addEventListener("dragleave", dragOver);
  dropZoneInput.addEventListener("dragover", dragOver);
  dropZoneInput.addEventListener("drop", gestorFicheros);

  function dragOver(event) {
    event.preventDefault();
    event.stopPropagation();
    event.target.className = (event.type === "dragover" ? "dragover" : "");
  }

  function gestorFicheros(event){
    dragOver(event);
    let files = event.target.files || event.dataTransfer.files;
    for (let i = 0, f; f = files[i]; i++) {
      parsearFichero(f);
    }      
  }
  function parsearFichero(file) {
    dropZoneInput.className = "border border-primary text-center p-3 mb-2";
    const mensajeOriginal = dropZoneInput.innerHTML; // Guarda el contenido original
    dropZoneInput.innerHTML = 'Elemento añadido'; // Muestra el mensaje de feedback

    setTimeout(() => {
        dropZoneInput.innerHTML = mensajeOriginal; // Restaura el mensaje original después de 1.5 segundos
    }, 1500);
    
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    selectorImagen.files = dataTransfer.files;
  }

  //logica de carrito
  document.getElementById("jets-container").addEventListener("click", (event) => {
    if (event.target.classList.contains("agregar-carrito")) {
      const button = event.target;
      const id = button.dataset.id;
      const nombre = button.dataset.nombre;
      const precio = parseFloat(button.dataset.precio);
      const img = button.dataset.img;
  
  
      if (!carrito[id]) {
        carrito[id] = { nombre, precio, cantidad: 1, img };
      } else if (carrito[id].cantidad < 20) {
        carrito[id].cantidad++;
      }
  
      actualizarCarrito(carrito);
  
      // Hide the button and show "Añadido" text for 2 seconds
      const originalButtonContent = button.innerHTML;
      button.innerHTML = 'Añadido!';
      button.disabled = true;
  
      setTimeout(() => {
        button.innerHTML = originalButtonContent;
        button.disabled = false;
      }, 2000);
    } else if (event.target.classList.contains("product-image")) {
      const imgSrc = event.target.src;
      const description = event.target.dataset.description;
      const nombre = event.target.dataset.nombre;
      const modalImage = document.getElementById("modalImage");
      const modalDescription = document.getElementById("modalDescription");
      const modalAttributes = document.getElementById("modalAttributes");
      const modalPrice = document.getElementById("modalPrice"); // Nuevo elemento para el precio
      const productModal = new bootstrap.Modal(document.getElementById("productModal"));
  
      // Buscar el producto en la lista de productos
      const prod = productos.find(p => p.nombre === nombre);
  
      if (!prod) {
        console.error("Producto no encontrado:", nombre);
        return;
      }
  
      // Generar los atributos según el tipo de producto
      let extra = "";
      if (prod instanceof JetGrande || prod instanceof JetMediano || prod instanceof JetPequeno) {
        extra = `<p><strong>Pasajeros:</strong> ${prod.num_pasajeros} pax</p>`;
      } else if (prod instanceof Avioneta) {
        extra = `<p><strong>Alcance:</strong> ${prod.alcance} km</p>`;
      } else if (prod instanceof Helicoptero) {
        extra = `<p><strong>Facilidades:</strong> ${prod.facilidades.join(", ")}</p>`;
      }
  
      // Asignar valores al modal
      modalImage.src = imgSrc;
      modalDescription.textContent = description;
      modalAttributes.innerHTML = `${extra}`; // Atributo específico
      modalPrice.innerHTML = `<p><strong>Precio:</strong> $${prod.precio.toLocaleString()}</p>`; // Precio
      document.getElementById("productModalLabel").textContent = nombre;
  
      productModal.show();
    }
  });


  document.getElementById("carrito").addEventListener("input", (event) => {
    if (event.target.type === "number") {
      const id = event.target.dataset.id;
      const cantidad = parseInt(event.target.value);
      if (cantidad > 0 && cantidad <= 20) {
        carrito[id].cantidad = cantidad;
        actualizarCarrito(carrito);
      }
    }
  });
});

const filterItems = document.querySelectorAll('.dropdown-item');
const dropdownButton = document.querySelector('.btn-group .dropdown-toggle');

filterItems.forEach(item => {
  item.addEventListener('click', () => {
    filterItems.forEach(it => it.classList.remove('active'));
    item.classList.add('active');

    const filterValue = item.textContent.trim();
    dropdownButton.textContent = filterValue;
    if (filterValue === 'Todos') {
      titulo.textContent = `Todos los productos`;
    } else {
      titulo.textContent = `Buscando: ${filterValue}`;
    }

    switch (filterValue) {
      case 'Todos':
        filtroTipo = null;
        break;
      case 'Jet Grande':
        filtroTipo = JetGrande;
        break;
      case 'Jet Mediano':
        filtroTipo = JetMediano;
        break;
      case 'Jet Pequeño':
        filtroTipo = JetPequeno;
        break;
      case 'Avioneta':
        filtroTipo = Avioneta;
        break;
      case 'Helicóptero':
        filtroTipo = Helicoptero;
        break;
      default:
        filtroTipo = null;
        break;
    }

    actualizarTituloYProductos(buscador, titulo, true);
  });
});

buscador.addEventListener("input", () => {
  actualizarTituloYProductos(buscador, titulo);
});

function actualizarTituloYProductos(buscador, titulo, isFilterClick = false) {
  const input = buscador.value.toLowerCase();
  if (!isFilterClick) {
    titulo.textContent = input ? `Buscando por: ${input}` : "Todos los productos";
  }

  productosFiltrados = productos.filter(producto => 
    producto.nombre.toLowerCase().includes(input) && (filtroTipo === null || producto instanceof filtroTipo) && producto.precio <= filtroPrecio
  );

  renderPagina();
  paginaActual = 1;
}

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
        <div class="card h-100 position-relative">
          <img src="${prod.imagen}" class="card-img-top product-image" 
          alt="${prod.nombre}" 
          data-description="${prod.descripcion}" 
          data-nombre="${prod.nombre}"
          data-precio="${prod.precio}"
          data-attributes="${extra.replace(/<[^>]+>/g, '')}">
          <button class="btn btn-success agregar-carrito position-absolute top-0 end-0 m-2" data-id="${prod.id}" data-nombre="${prod.nombre}" data-precio="${prod.precio}" data-img="${prod.imagen}">
            <i class="bi bi-cart"></i>
            <img src="imagenes/carrito.png" alt="Añadir al carrito" style="width: 24px; height: 24px;">
          </button>
          <div class="card-body">
            <h5 class="card-title">${prod.nombre}</h5>
            <p class="card-text text-truncate">${prod.descripcion}</p>
            <p class="card-text"><strong>Precio:</strong> $${prod.precio.toLocaleString()}</p>
            ${extra}
          </div>
        </div>
      </div>
    `;
    contenedorProductos.innerHTML += card;
  });
}


function renderPagina() {
  const totalPaginas = Math.ceil(productosFiltrados.length / productosPorPagina);

  if (totalPaginas > 0 && paginaActual > totalPaginas) {
    paginaActual = totalPaginas;
  }
  if (paginaActual < 1) {
    paginaActual = 1;
  }

  const inicio = (paginaActual - 1) * productosPorPagina;
  const fin = inicio + productosPorPagina;
  const productosPagina = productosFiltrados.slice(inicio, fin);

  renderProductos(productosPagina);
  renderPaginacion(totalPaginas);
}

function renderPaginacion(totalPaginas) {
  paginacionDiv.innerHTML = "";
  if (totalPaginas <= 0) return;

  if (paginaActual > 1) {
    const btnAnterior = document.createElement("button");
    btnAnterior.className = "btn btn-secondary me-2";
    btnAnterior.textContent = "Anterior";
    btnAnterior.addEventListener("click", () => {
      cambiarPagina(paginaActual - 1);
    });
    paginacionDiv.appendChild(btnAnterior);
  }

  for (let i = 1; i <= totalPaginas; i++) {
    const btn = document.createElement("button");
    btn.className = "btn me-1 " + (i === paginaActual ? "btn-primary" : "btn-outline-primary");
    btn.textContent = i;
    btn.addEventListener("click", () => {
      cambiarPagina(i);
    });
    paginacionDiv.appendChild(btn);
  }

  if (paginaActual < totalPaginas) {
    const btnSiguiente = document.createElement("button");
    btnSiguiente.className = "btn btn-secondary";
    btnSiguiente.textContent = "Siguiente";
    btnSiguiente.addEventListener("click", () => {
      cambiarPagina(paginaActual + 1);
    });
    paginacionDiv.appendChild(btnSiguiente);
  }
}

function cambiarPagina(nuevaPagina) {
  paginaActual = nuevaPagina;
  renderPagina();
}

window.cambiarPagina = cambiarPagina;

const formJet = document.getElementById("formulario-jet");
formJet.addEventListener("submit", (e) => {
  e.preventDefault();

  const tipo = document.getElementById("tipoJet").value;
  const nombre = document.getElementById("nombre").value;
  const precio = parseFloat(document.getElementById("precio").value);
  const descripcion = document.getElementById("descripcion").value;
  const imagenInput = document.getElementById("imagenJet").files[0];
  let imagenUrl = imagenInput ? URL.createObjectURL(imagenInput) : null;

  const extraValue = document.getElementById("extra").value;

  if (!tipo || !nombre || isNaN(precio) || !extraValue) {
    alert("Por favor, rellena todos los campos obligatorios.");
    return;
  }

  let nuevoProducto;
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
  } else if (tipo === "Avioneta") {
    const alcanceKm = parseFloat(extraValue);
    if (isNaN(alcanceKm)) {
      alert("Por favor, ingresa un número válido para el alcance en km.");
      return;
    }
    nuevoProducto = new Avioneta(nombre, precio, descripcion, imagenUrl, alcanceKm);
  } else if (tipo === "Helicóptero") {
    const facilidades = extraValue.split(",").map(f => f.trim()).filter(f => f !== "");
    if (facilidades.length === 0) {
      alert("Por favor, ingresa al menos una facilidad.");
      return;
    }
    nuevoProducto = new Helicoptero(nombre, precio, descripcion, imagenUrl, facilidades);
  } else {
    alert("Tipo de producto no válido");
    return;
  }

  productos.push(nuevoProducto);
  productosFiltrados = [...productos];
  paginaActual = 1;
  renderPagina();
  // Mostrar mensaje de éxito
  const mensajeExito = document.getElementById("mensaje-exito");
  mensajeExito.classList.remove("d-none");

  setTimeout(() => {
    mensajeExito.classList.add("d-none");
  }, 2000);
  formJet.reset();
});

const rangoPrecio = document.getElementById('rangoPrecio');
const rangoPrecioValue = document.getElementById('rangoPrecioValue');

rangoPrecio.addEventListener('input', () => {
  filtroPrecio = parseInt(rangoPrecio.value);
  rangoPrecioValue.textContent = convertToInternationalCurrencySystem(filtroPrecio);
  actualizarTituloYProductos(buscador, titulo, true);
});


function convertToInternationalCurrencySystem (labelValue) {

  return Math.abs(Number(labelValue)) >= 1.0e+6

  ? (Math.abs(Number(labelValue)) / 1.0e+6).toFixed(2) + "M"

  : Math.abs(Number(labelValue)) >= 1.0e+3

  ? (Math.abs(Number(labelValue)) / 1.0e+3).toFixed(2) + "K"

  : Math.abs(Number(labelValue));

}