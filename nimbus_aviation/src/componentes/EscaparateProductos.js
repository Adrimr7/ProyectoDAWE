"use client"

import { useState, useEffect } from "react"
import BuscadorProductos from "./BuscadorProductos"
import Paginacion from "./Paginacion"
import DetallesProducto from "./DetallesProducto"
import { JetGrande, JetMediano, JetPequeno, Avioneta, Helicoptero } from "../tienda/tienda"

function EscaparateProductos({
  productos,
  filtroTipo,
  setFiltroTipo,
  filtroPrecio,
  setFiltroPrecio,
  searchTerm,
  setSearchTerm,
  addToCart,
}) {
  const [currentPage, setCurrentPage] = useState(1)
  const [productosFiltrados, setProductosFiltrados] = useState([])
  const [title, setTitle] = useState("Todos los productos")
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const productosPorPagina = 6

  useEffect(() => {
    const filtered = productos.filter(
      (producto) =>
        producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (filtroTipo === null || producto instanceof filtroTipo) &&
        producto.precio <= filtroPrecio,
    )

    setProductosFiltrados(filtered)

    // Update title based on search and filters
    if (searchTerm) {
      setTitle(`Buscando por: ${searchTerm}`)
    } else if (filtroTipo) {
      const tipoName = getTipoName(filtroTipo)
      setTitle(`Buscando: ${tipoName}`)
    } else {
      setTitle("Todos los productos")
    }
  }, [productos, searchTerm, filtroTipo, filtroPrecio])

  const getTipoName = (tipo) => {
    if (tipo === JetGrande) return "Jet Grande"
    if (tipo === JetMediano) return "Jet Mediano"
    if (tipo === JetPequeno) return "Jet Pequeño"
    if (tipo === Avioneta) return "Avioneta"
    if (tipo === Helicoptero) return "Helicóptero"
    return "Todos"
  }

  const handleFilterClick = (tipo) => {
    setFiltroTipo(tipo)
    setCurrentPage(1) // Volver a la primera página al cambiar el filtro
  }

  const handlePriceChange = (e) => {
    setFiltroPrecio(Number.parseInt(e.target.value))
    setCurrentPage(1) // Volver a la primera página al cambiar el precio
  }

  const convertToInternationalCurrencySystem = (labelValue) => {
    return Math.abs(Number(labelValue)) >= 1.0e6
      ? (Math.abs(Number(labelValue)) / 1.0e6).toFixed(2) + "M"
      : Math.abs(Number(labelValue)) >= 1.0e3
        ? (Math.abs(Number(labelValue)) / 1.0e3).toFixed(2) + "K"
        : Math.abs(Number(labelValue))
  }

  const openProductDetails = (product) => {
    setSelectedProduct(product)
    setShowModal(true)
  }

  const closeProductDetails = () => {
    setShowModal(false)
  }

  // Calculate pagination
  const totalPages = Math.ceil(productosFiltrados.length / productosPorPagina)
  const startIndex = (currentPage - 1) * productosPorPagina
  const endIndex = startIndex + productosPorPagina
  const currentProducts = productosFiltrados.slice(startIndex, endIndex)

  const renderProductCard = (product) => {
    let extraInfo = ""
    if (product instanceof JetGrande || product instanceof JetMediano || product instanceof JetPequeno) {
      extraInfo = (
        <p className="card-text">
          <strong>Pasajeros:</strong> {product.num_pasajeros} pax
        </p>
      )
    } else if (product instanceof Avioneta) {
      extraInfo = (
        <p className="card-text">
          <strong>Alcance:</strong> {product.alcance} km
        </p>
      )
    } else if (product instanceof Helicoptero) {
      extraInfo = (
        <p className="card-text">
          <strong>Facilidades:</strong> {product.facilidades.join(", ")}
        </p>
      )
    }

    return (
      <div className="col-md-4 mb-3" key={product.id}>
        <div className="card h-100 position-relative">
          <img
            src={product.imagen || "/placeholder.svg"}
            className="card-img-top product-image"
            alt={product.nombre}
            onClick={() => openProductDetails(product)}
            style={{ cursor: "pointer" }}
            data-description={product.descripcion}
            data-nombre={product.nombre}
          />
          <button
            className="btn btn-success agregar-carrito position-absolute top-0 end-0 m-2"
            onClick={() => {
              addToCart(product)
              const btn = document.activeElement
              const originalText = btn.innerHTML
              btn.innerHTML = "Añadido!"
              btn.disabled = true
              setTimeout(() => {
                btn.innerHTML = originalText
                btn.disabled = false
              }, 2000)
            }}
            data-id={product.id}
            data-nombre={product.nombre}
            data-precio={product.precio}
            data-img={product.imagen}
          >
            <img src="imagenes/carrito.png" alt="Añadir al carrito" style={{ width: "24px", height: "24px" }} />
          </button>
          <div className="card-body">
            <h5 className="card-title">{product.nombre}</h5>
            <p className="card-text text-truncate">{product.descripcion}</p>
            <p className="card-text">
              <strong>Precio:</strong> ${product.precio.toLocaleString()}
            </p>
            {extraInfo}
          </div>
        </div>
      </div>
    )
  }

  return (
    <main className="col-md-8">
      <BuscadorProductos
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        title={title}
        setCurrentPage={setCurrentPage}
      />

      <div className="btn-group mt-2" role="group" aria-label="Filtros de tipo">
        <button
          type="button"
          className="btn btn-outline-primary dropdown-toggle"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          Filtrar por tipo
        </button>
        <ul className="dropdown-menu">
          <li>
            <a
              className={`dropdown-item ${filtroTipo === null ? "active" : ""}`}
              href="#"
              onClick={(e) => {
                e.preventDefault()
                handleFilterClick(null)
              }}
            >
              Todos
            </a>
          </li>
          <li>
            <a
              className={`dropdown-item ${filtroTipo === JetGrande ? "active" : ""}`}
              href="#"
              onClick={(e) => {
                e.preventDefault()
                handleFilterClick(JetGrande)
              }}
            >
              Jet Grande
            </a>
          </li>
          <li>
            <a
              className={`dropdown-item ${filtroTipo === JetMediano ? "active" : ""}`}
              href="#"
              onClick={(e) => {
                e.preventDefault()
                handleFilterClick(JetMediano)
              }}
            >
              Jet Mediano
            </a>
          </li>
          <li>
            <a
              className={`dropdown-item ${filtroTipo === JetPequeno ? "active" : ""}`}
              href="#"
              onClick={(e) => {
                e.preventDefault()
                handleFilterClick(JetPequeno)
              }}
            >
              Jet Pequeño
            </a>
          </li>
          <li>
            <a
              className={`dropdown-item ${filtroTipo === Avioneta ? "active" : ""}`}
              href="#"
              onClick={(e) => {
                e.preventDefault()
                handleFilterClick(Avioneta)
              }}
            >
              Avioneta
            </a>
          </li>
          <li>
            <a
              className={`dropdown-item ${filtroTipo === Helicoptero ? "active" : ""}`}
              href="#"
              onClick={(e) => {
                e.preventDefault()
                handleFilterClick(Helicoptero)
              }}
            >
              Helicóptero
            </a>
          </li>
        </ul>
      </div>

      <div className="mt-2">
        <label htmlFor="rangoPrecio" className="form-label">
          Filtrar por precio: <span id="rangoPrecioValue">{convertToInternationalCurrencySystem(filtroPrecio)}</span> $
        </label>
        <input
          type="range"
          className="form-range"
          min="300000"
          max="120000000"
          step="100000"
          id="rangoPrecio"
          value={filtroPrecio}
          onChange={handlePriceChange}
        />
      </div>

      <div id="jets-container" className="row">
        {currentProducts.map((product) => renderProductCard(product))}
      </div>

      <Paginacion
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalProducts={productosFiltrados.length}
        productsPerPage={productosPorPagina}
      />

      {selectedProduct && <DetallesProducto product={selectedProduct} show={showModal} onHide={closeProductDetails} />}
    </main>
  )
}

export default EscaparateProductos

