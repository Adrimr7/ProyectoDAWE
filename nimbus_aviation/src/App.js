"use client"

import { useState } from "react"

// Header Component
function Header({ toggleCart }) {
  return (
    <header className="bg-dark text-white p-3">
      <h1>Nimbus Aviation</h1>
      <nav>
        <ul className="nav">
          <li className="nav-item">
            <a className="nav-link text-white" href="#">
              Página de Inicio
            </a>
          </li>
          <li className="nav-item">
            <a
              className="nav-link text-white"
              href="#"
              onClick={(e) => {
                e.preventDefault()
                toggleCart()
              }}
            >
              Carrito de la compra
            </a>
          </li>
        </ul>
      </nav>
    </header>
  )
}

// Product Card Component
function ProductCard({ product, addToCart, openProductDetails }) {
  const { id, nombre, descripcion, precio, imagen, tipo, extra } = product

  return (
    <div className="col-md-4 mb-3">
      <div className="card h-100 position-relative">
        <img
          src={imagen || "/placeholder.svg?height=200&width=300"}
          className="card-img-top product-image"
          alt={nombre}
          onClick={() => openProductDetails(product)}
          style={{ cursor: "pointer", height: "200px", objectFit: "cover" }}
        />
        <button
          className="btn btn-success position-absolute top-0 end-0 m-2"
          onClick={() => {
            addToCart(product)
            const btn = document.activeElement
            btn.innerText = "Añadido!"
            btn.disabled = true
            setTimeout(() => {
              btn.innerText = "🛒"
              btn.disabled = false
            }, 2000)
          }}
        >
          🛒
        </button>
        <div className="card-body">
          <h5 className="card-title">{nombre}</h5>
          <p className="card-text text-truncate">{descripcion}</p>
          <p className="card-text">
            <strong>Precio:</strong> ${precio.toLocaleString()}
          </p>
          {extra && (
            <p className="card-text">
              <strong>
                {tipo === "Avioneta" ? "Alcance:" : tipo === "Helicoptero" ? "Facilidades:" : "Pasajeros:"}
              </strong>{" "}
              {extra}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

// Product Search Component
function ProductSearch({ searchTerm, setSearchTerm, title }) {
  return (
    <div className="mb-3">
      <h2>{title}</h2>
      <input
        type="text"
        className="form-control"
        placeholder="Buscar productos..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  )
}

// Pagination Component
function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 0) return null

  return (
    <div className="text-center mt-4">
      {currentPage > 1 && (
        <button className="btn btn-secondary me-2" onClick={() => onPageChange(currentPage - 1)}>
          Anterior
        </button>
      )}

      {[...Array(totalPages)].map((_, i) => (
        <button
          key={i + 1}
          className={`btn me-1 ${i + 1 === currentPage ? "btn-primary" : "btn-outline-primary"}`}
          onClick={() => onPageChange(i + 1)}
        >
          {i + 1}
        </button>
      ))}

      {currentPage < totalPages && (
        <button className="btn btn-secondary" onClick={() => onPageChange(currentPage + 1)}>
          Siguiente
        </button>
      )}
    </div>
  )
}

// Product Details Modal
function ProductDetails({ product, show, onHide }) {
  if (!product || !show) return null

  const { nombre, descripcion, precio, imagen, tipo, extra } = product

  return (
    <div className="modal show" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{nombre}</h5>
            <button type="button" className="btn-close" onClick={onHide}></button>
          </div>
          <div className="modal-body">
            <div className="row">
              <div className="col-md-6">
                <img src={imagen || "/placeholder.svg?height=200&width=300"} className="img-fluid" alt={nombre} />
              </div>
              <div className="col-md-6">
                <p>{descripcion}</p>
                <p>
                  <strong>Precio:</strong> ${precio.toLocaleString()}
                </p>
                {extra && (
                  <p>
                    <strong>
                      {tipo === "Avioneta" ? "Alcance:" : tipo === "Helicoptero" ? "Facilidades:" : "Pasajeros:"}
                    </strong>{" "}
                    {extra}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Cart Component
function Cart({ carrito, updateCartItem, show, onHide }) {
  const calculateTotal = () => {
    let total = 0
    for (const id in carrito) {
      total += carrito[id].precio * carrito[id].cantidad
    }
    return total
  }

  if (!show) return null

  return (
    <div className="offcanvas offcanvas-start show" tabIndex="-1" style={{ visibility: "visible" }}>
      <div className="offcanvas-header">
        <h5 className="offcanvas-title">Carrito de la compra</h5>
        <button type="button" className="btn-close" onClick={onHide}></button>
      </div>
      <div className="offcanvas-body">
        <div className="overflow-auto" style={{ maxHeight: "70vh" }}>
          {Object.keys(carrito).length === 0 ? (
            <p>No hay productos en el carrito</p>
          ) : (
            Object.entries(carrito).map(([id, { nombre, precio, cantidad, img }]) => (
              <div className="d-flex align-items-center mb-3" key={id}>
                <img src={img || "/placeholder.svg?height=50&width=50"} width="50" className="me-3" alt={nombre} />
                <div>
                  <h6>{nombre}</h6>
                  <p>${precio.toLocaleString()} c/u</p>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    value={cantidad}
                    className="form-control w-50"
                    onChange={(e) => updateCartItem(id, Number.parseInt(e.target.value))}
                  />
                  <p>Total: ${(precio * cantidad).toLocaleString()}</p>
                </div>
              </div>
            ))
          )}
        </div>
        <h5 className="mt-3">Total: ${calculateTotal().toLocaleString()}</h5>
      </div>
    </div>
  )
}

// New Product Form
function NewProductForm({ addProduct }) {
  const [formData, setFormData] = useState({
    tipo: "Jet Grande",
    nombre: "",
    precio: "",
    descripcion: "",
    extra: "",
  })
  const [showSuccess, setShowSuccess] = useState(false)

  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!formData.tipo || !formData.nombre || !formData.precio || !formData.extra) {
      alert("Por favor, rellena todos los campos obligatorios.")
      return
    }

    const newProduct = {
      id: Math.random().toString(36).substr(2, 9),
      ...formData,
      precio: Number.parseFloat(formData.precio),
      imagen: "/placeholder.svg?height=200&width=300",
      tipo: formData.tipo,
    }

    addProduct(newProduct)

    // Reset form
    setFormData({
      tipo: "Jet Grande",
      nombre: "",
      precio: "",
      descripcion: "",
      extra: "",
    })

    // Show success message
    setShowSuccess(true)
    setTimeout(() => {
      setShowSuccess(false)
    }, 2000)
  }

  return (
    <aside className="col-md-4 mt-4">
      <h2>Agregar un Producto</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <select id="tipo" className="form-control" value={formData.tipo} onChange={handleChange}>
            <option value="">Selecciona un tipo</option>
            <option value="Jet Grande">Jet Grande</option>
            <option value="Jet Mediano">Jet Mediano</option>
            <option value="Jet Pequeño">Jet Pequeño</option>
            <option value="Avioneta">Avioneta</option>
            <option value="Helicoptero">Helicóptero</option>
          </select>
        </div>

        <div className="mb-2">
          <input
            type="text"
            id="nombre"
            className="form-control"
            placeholder="Nombre del producto"
            value={formData.nombre}
            onChange={handleChange}
          />
        </div>

        <div className="mb-2">
          <input
            type="number"
            id="precio"
            className="form-control"
            placeholder="Precio ($)"
            value={formData.precio}
            onChange={handleChange}
          />
        </div>

        <div className="mb-2">
          <textarea
            id="descripcion"
            className="form-control"
            placeholder="Descripción"
            value={formData.descripcion}
            onChange={handleChange}
          />
        </div>

        <div className="mb-2">
          <input
            type="text"
            id="extra"
            className="form-control"
            placeholder={
              formData.tipo === "Jet Grande" || formData.tipo === "Jet Mediano" || formData.tipo === "Jet Pequeño"
                ? "Número de pasajeros"
                : formData.tipo === "Avioneta"
                  ? "Alcance en kilómetros"
                  : formData.tipo === "Helicoptero"
                    ? "Facilidades (separadas por comas)"
                    : "Atributo extra"
            }
            value={formData.extra}
            onChange={handleChange}
          />
        </div>

        <div className="mb-2">
          <input type="file" id="imagen" className="form-control" />
        </div>

        <div className="border border-primary text-center p-3 mb-2">Arrastra y suelta aquí la imagen del producto</div>

        <button type="submit" className="btn btn-primary">
          Agregar Producto
        </button>
      </form>

      <div className={`alert alert-success mt-3 ${showSuccess ? "" : "d-none"}`} role="alert">
        Producto añadido con éxito!
      </div>
    </aside>
  )
}

// Footer Component
function Footer() {
  return (
    <footer className="bg-dark text-white text-center p-3 mt-4">
      <p>&copy; {new Date().getFullYear()} Nimbus Aviation. Todos los derechos reservados.</p>
    </footer>
  )
}

// Sample product data
const sampleProducts = [
  {
    id: "1",
    nombre: "Gulfstream G650",
    descripcion: "Jet de largo alcance y lujo. Considerado un símbolo de estatus en la aviación privada.",
    precio: 59800000,
    imagen: "/placeholder.svg?height=200&width=300",
    tipo: "Jet Grande",
    extra: "19",
  },
  {
    id: "2",
    nombre: "Cessna Citation X+",
    descripcion: "Jet mediano con gran velocidad. El jet ejecutivo más rápido del mundo.",
    precio: 35000000,
    imagen: "/placeholder.svg?height=200&width=300",
    tipo: "Jet Mediano",
    extra: "12",
  },
  {
    id: "3",
    nombre: "Honda HondaJet Elite",
    descripcion: "Jet pequeño con alta eficiencia y configuración innovadora de motores.",
    precio: 25000000,
    imagen: "/placeholder.svg?height=200&width=300",
    tipo: "Jet Pequeño",
    extra: "6",
  },
  {
    id: "4",
    nombre: "Beechcraft Bonanza G36",
    descripcion: "Avioneta premium para los más exigentes con gran estabilidad.",
    precio: 875000,
    imagen: "/placeholder.svg?height=200&width=300",
    tipo: "Avioneta",
    extra: "1482",
  },
  {
    id: "5",
    nombre: "Bell 407",
    descripcion: "Helicóptero de lujo con gran capacidad y acabados premium.",
    precio: 1300000,
    imagen: "/placeholder.svg?height=200&width=300",
    tipo: "Helicoptero",
    extra: "Wi-Fi, Cámara profesional",
  },
  {
    id: "6",
    nombre: "Bombardier Global 8000",
    descripcion: "Gama premium, intercontinental, moderno y de extra lujo.",
    precio: 92000000,
    imagen: "/placeholder.svg?height=200&width=300",
    tipo: "Jet Grande",
    extra: "22",
  },
]

// Main App Component
function App() {
  const [productos, setProductos] = useState(sampleProducts)
  const [carrito, setCarrito] = useState({})
  const [filtroTipo, setFiltroTipo] = useState(null)
  const [filtroPrecio, setFiltroPrecio] = useState(100000000)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [showCart, setShowCart] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const productosPorPagina = 3

  // Filter products based on search, type, and price
  const productosFiltrados = productos.filter(
    (producto) =>
      producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filtroTipo === null || producto.tipo === filtroTipo) &&
      producto.precio <= filtroPrecio,
  )

  // Calculate pagination
  const totalPages = Math.ceil(productosFiltrados.length / productosPorPagina)
  const startIndex = (currentPage - 1) * productosPorPagina
  const endIndex = startIndex + productosPorPagina
  const currentProducts = productosFiltrados.slice(startIndex, endIndex)

  // Add to cart function
  const addToCart = (product) => {
    setCarrito((prevCarrito) => {
      const newCarrito = { ...prevCarrito }
      if (!newCarrito[product.id]) {
        newCarrito[product.id] = {
          nombre: product.nombre,
          precio: product.precio,
          cantidad: 1,
          img: product.imagen,
        }
      } else if (newCarrito[product.id].cantidad < 20) {
        newCarrito[product.id].cantidad++
      }
      return newCarrito
    })
  }

  // Update cart item quantity
  const updateCartItem = (id, cantidad) => {
    setCarrito((prevCarrito) => {
      const newCarrito = { ...prevCarrito }
      if (cantidad <= 0) {
        delete newCarrito[id]
      } else {
        newCarrito[id].cantidad = cantidad
      }
      return newCarrito
    })
  }

  // Add new product
  const addProduct = (newProduct) => {
    setProductos((prevProductos) => [...prevProductos, newProduct])
  }

  // Open product details modal
  const openProductDetails = (product) => {
    setSelectedProduct(product)
    setShowModal(true)
  }

  // Close product details modal
  const closeProductDetails = () => {
    setShowModal(false)
  }

  // Toggle cart visibility
  const toggleCart = () => {
    setShowCart(!showCart)
  }

  // Get title based on filters
  const getTitle = () => {
    if (searchTerm) {
      return `Buscando por: ${searchTerm}`
    } else if (filtroTipo) {
      return `Buscando: ${filtroTipo}`
    } else {
      return "Todos los productos"
    }
  }

  return (
    <div
      style={{
        margin: "0 auto",
        width: "90%",
        backgroundColor: "skyblue",
        minHeight: "100vh",
        borderLeft: "5px solid #333",
        borderRight: "5px solid #333",
      }}
    >
      <Header toggleCart={toggleCart} />

      {showCart && (
        <Cart carrito={carrito} updateCartItem={updateCartItem} show={showCart} onHide={() => setShowCart(false)} />
      )}

      <div className="container mt-4">
        <div className="row">
          <main className="col-md-8">
            <ProductSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} title={getTitle()} />

            <div className="btn-group mt-2 mb-3" role="group">
              <button
                type="button"
                className={`btn ${filtroTipo === null ? "btn-primary" : "btn-outline-primary"}`}
                onClick={() => setFiltroTipo(null)}
              >
                Todos
              </button>
              <button
                type="button"
                className={`btn ${filtroTipo === "Jet Grande" ? "btn-primary" : "btn-outline-primary"}`}
                onClick={() => setFiltroTipo("Jet Grande")}
              >
                Jet Grande
              </button>
              <button
                type="button"
                className={`btn ${filtroTipo === "Jet Mediano" ? "btn-primary" : "btn-outline-primary"}`}
                onClick={() => setFiltroTipo("Jet Mediano")}
              >
                Jet Mediano
              </button>
              <button
                type="button"
                className={`btn ${filtroTipo === "Jet Pequeño" ? "btn-primary" : "btn-outline-primary"}`}
                onClick={() => setFiltroTipo("Jet Pequeño")}
              >
                Jet Pequeño
              </button>
              <button
                type="button"
                className={`btn ${filtroTipo === "Avioneta" ? "btn-primary" : "btn-outline-primary"}`}
                onClick={() => setFiltroTipo("Avioneta")}
              >
                Avioneta
              </button>
              <button
                type="button"
                className={`btn ${filtroTipo === "Helicoptero" ? "btn-primary" : "btn-outline-primary"}`}
                onClick={() => setFiltroTipo("Helicoptero")}
              >
                Helicóptero
              </button>
            </div>

            <div className="mt-2 mb-4">
              <label htmlFor="rangoPrecio" className="form-label">
                Filtrar por precio: <span>{(filtroPrecio / 1000000).toFixed(1)}M</span> $
              </label>
              <input
                type="range"
                className="form-range"
                min="300000"
                max="100000000"
                step="100000"
                id="rangoPrecio"
                value={filtroPrecio}
                onChange={(e) => setFiltroPrecio(Number.parseInt(e.target.value))}
              />
            </div>

            <div className="row">
              {currentProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  addToCart={addToCart}
                  openProductDetails={openProductDetails}
                />
              ))}
            </div>

            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </main>

          <NewProductForm addProduct={addProduct} />
        </div>
      </div>

      <Footer />

      {selectedProduct && <ProductDetails product={selectedProduct} show={showModal} onHide={closeProductDetails} />}
    </div>
  )
}

export default App

