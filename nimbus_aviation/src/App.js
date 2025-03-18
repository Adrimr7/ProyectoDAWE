"use client"

import { useState } from "react"
import Cabecera from "./componentes/Cabecera"
import EscaparateProductos from "./componentes/EscaparateProductos"
import FormularioNuevosProductos from "./componentes/FormularioNuevosProductos"
import Pie from "./componentes/Pie"
import Carrito from "./componentes/Carrito"
import { productos as initialProductos } from "./tienda/tienda"
import "./App.css"

function App() {
  const [productos, setProductos] = useState(initialProductos)
  const [carrito, setCarrito] = useState({})
  const [filtroTipo, setFiltroTipo] = useState(null)
  const [filtroPrecio, setFiltroPrecio] = useState(120000000)
  const [searchTerm, setSearchTerm] = useState("")
  const [showCart, setShowCart] = useState(false)

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

  const addProduct = (newProduct) => {
    setProductos((prevProductos) => [...prevProductos, newProduct])
  }

  const toggleCart = () => {
    setShowCart(!showCart)
  }

  return (
    <div id="content">
      <Cabecera toggleCart={toggleCart} title="Nimbus Aviation" />

      <Carrito carrito={carrito} updateCartItem={updateCartItem} show={showCart} onHide={() => setShowCart(false)} />

      <div className="container mt-4">
        <div className="row">
          <EscaparateProductos
            productos={productos}
            filtroTipo={filtroTipo}
            setFiltroTipo={setFiltroTipo}
            filtroPrecio={filtroPrecio}
            setFiltroPrecio={setFiltroPrecio}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            addToCart={addToCart}
          />

          <FormularioNuevosProductos addProduct={addProduct} />
        </div>
      </div>

      <Pie content="&copy; 2025 Nimbus Aviation. Todos los derechos reservados." />
    </div>
  )
}

export default App

