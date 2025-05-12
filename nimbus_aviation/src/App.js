"use client"

import { useState, useEffect } from "react"
import Cabecera from "./componentes/Cabecera"
import EscaparateProductos from "./componentes/EscaparateProductos"
import Pie from "./componentes/Pie"
import Carrito from "./componentes/Carrito"
import { productos as initialProductos, guardarEnCarrito, borrarDelCarrito, cargarCarrito } from "./tienda/tienda"
import "./App.css"
import MiCuenta from "./componentes/MiCuenta"
import AnadirProducto from "./componentes/AnadirProducto"
import EditarYBorrarProductos from "./componentes/EditarYBorrarProductos"
import PanelLateral from "./componentes/PanelLateral"

function App() {
  const [productos, setProductos] = useState(initialProductos)
  const [carrito, setCarrito] = useState({})
  const [filtroTipo, setFiltroTipo] = useState(null)
  const [filtroPrecio, setFiltroPrecio] = useState(120000000)
  const [filtroPrecioMin, setFiltroPrecioMin] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")
  const [showCart, setShowCart] = useState(false)
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [seccionActiva, setSeccionActiva] = useState("inicio")

  // 🔹 Cargar el carrito desde localStorage al inicio
  useEffect(() => {
    const carritoCargado = cargarCarrito()
    setCarrito(carritoCargado)
  }, [])

  // 🔹 Guardar el carrito en localStorage cada vez que cambie
  useEffect(() => {
    Object.keys(carrito).forEach((productoId) => {
      guardarEnCarrito(productoId, carrito[productoId])
    })
  }, [carrito])

  // 🔹 Manejar el estado de conexión
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

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

      guardarEnCarrito(product.id, newCarrito[product.id]) // Guardar en localStorage
      return newCarrito
    })
  }

  const updateCartItem = (id, cantidad) => {
    setCarrito((prevCarrito) => {
      const newCarrito = { ...prevCarrito }
      if (cantidad <= 0) {
        delete newCarrito[id]
        borrarDelCarrito(id) // Borrar del localStorage si se elimina el producto
      } else {
        newCarrito[id].cantidad = cantidad
        guardarEnCarrito(id, newCarrito[id]) // Guardar cambios en localStorage
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

  const cambiarSeccion = (seccion) => {
    setSeccionActiva(seccion);
  }
  
  return (
    <><div id="content" className="d-flex flex-column">
      <Cabecera 
          className="cabecera" 
          toggleCart={toggleCart} 
          title="Nimbus Aviation" 
          isOnline={isOnline}
          seccionActiva={seccionActiva}
          cambiarSeccion={cambiarSeccion} 
        />

      <Carrito className="carro" carrito={carrito} updateCartItem={updateCartItem} show={showCart} onHide={() => setShowCart(false)} />

      <div className="container mt-4">
        <div className="row">
          {/* Contenido principal (cambia según la sección) - Lado izquierdo */}
            {seccionActiva === "inicio" && (
              <EscaparateProductos id="escaparate"
                productos={productos}
                filtroTipo={filtroTipo}
                setFiltroTipo={setFiltroTipo}
                filtroPrecio={filtroPrecio}
                setFiltroPrecio={setFiltroPrecio}
                filtroPrecioMin={filtroPrecioMin}
                setFiltroPrecioMin={setFiltroPrecioMin}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                addToCart={addToCart} />
            )}

            {seccionActiva === "mi-cuenta" && <MiCuenta />}
            
            {seccionActiva === "anadir-producto" && <AnadirProducto addProduct={addProduct} isOnline={isOnline} />}
            
            {seccionActiva === "editar-productos" && <EditarYBorrarProductos productos={initialProductos} addProduct={addProduct} isOnline={isOnline} />}
          
          {/* Formulario de login (siempre visible) - Lado derecho */}
          <div className="col-md-4">
            <PanelLateral />
          </div>
        </div>
      </div>
      </div>
      <Pie id="pie" content="&copy; 2025 Nimbus Aviation. Todos los derechos reservados." />
    </>
  )
}

export default App