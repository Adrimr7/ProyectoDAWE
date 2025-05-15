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
  const [initialProductos, setInitialProductos] = useState([]);
  const [productos, setProductos] = useState(initialProductos)
  const [carrito, setCarrito] = useState({})
  const [filtroTipo, setFiltroTipo] = useState(null)
  const [filtroPrecio, setFiltroPrecio] = useState(120000000)
  const [filtroPrecioMin, setFiltroPrecioMin] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")
  const [showCart, setShowCart] = useState(false)
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [seccionActiva, setSeccionActiva] = useState("inicio")
  const [usuario, setUsuario] = useState(null);
  const [autenticado, setAutenticado] = useState(false);
  const [loadingSession, setLoadingSession] = useState(true);


  useEffect(() => {
    setProductos(initialProductos);
  }, [initialProductos]);  
  
  const recargarProductos = async () => {
    const res = await fetch("http://localhost:5000/productos");
    const data = await res.json();
    setInitialProductos(data);
  };

  useEffect(() => {
    recargarProductos();
  }, []);

  useEffect(() => {
    fetch("http://localhost:5000/comprobar-sesion", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setAutenticado(data.autenticado);
        setLoadingSession(false);
      })
      .catch(() => {
        setAutenticado(false);
        setLoadingSession(false);
      });
  }, []);
  

  useEffect(() => {
    if (autenticado) {
      fetch("http://localhost:5000/usuarios/me", {
        credentials: "include",
      })
        .then((res) => res.ok ? res.json() : null)
        .then((data) => setUsuario(data));
    } else {
      setUsuario(null); // Cuando no hay sesión, limpiamos datos de usuario
    }
  }, [autenticado]);


  //Cargar el carrito desde localStorage al inicio
  useEffect(() => {
    const carritoCargado = cargarCarrito()
    setCarrito(carritoCargado)
  }, [])

  //Guardar el carrito en localStorage cada vez que cambie
  useEffect(() => {
    Object.entries(carrito).forEach(([id, producto]) => {
      guardarEnCarrito(id, producto);
    });
  }, [carrito]);


  //Manejar el estado de conexión
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
    const id = product._id;

    setCarrito((prevCarrito) => {
      const newCarrito = { ...prevCarrito };

      if (!newCarrito[id]) {
        newCarrito[id] = {
          nombre: product.nombre,
          precio: product.precio,
          cantidad: 1,
          img: product.imagen,
        };
      } else if (newCarrito[id].cantidad < 20) {
        newCarrito[id] = {
          ...newCarrito[id],
          cantidad: newCarrito[id].cantidad + 1
        };
      }

      return newCarrito;
    });
  };



  const borrarProducto = async (id) => {
    const res = await fetch(`http://localhost:5000/productos/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (res.ok) {
      setInitialProductos(prev => prev.filter(p => p._id !== id));
      setProductos(prev => prev.filter(p => p._id !== id));
    }
  };

  const recargarUsuario = async () => {
    const res = await fetch("http://localhost:5000/usuarios/me", {
      credentials: "include",
    });
    if (res.ok) {
      const data = await res.json();
      setUsuario(data);
    }
  };



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

  const addProduct = (nuevo) => {
    setInitialProductos((prev) => [...prev, nuevo]);
    setProductos((prev) => [...prev, nuevo]);
  };
  

  const toggleCart = () => {
    setShowCart(!showCart)
  }

  const cambiarSeccion = (seccion) => {
    setSeccionActiva(seccion);
  }

  if (loadingSession) return <div>Cargando sesión...</div>;
  
  return (
    <><div id="content" className="d-flex flex-column">
      <Cabecera 
        toggleCart={toggleCart}
        title="Nimbus Aviation"
        isOnline={isOnline}
        seccionActiva={seccionActiva}
        cambiarSeccion={cambiarSeccion}
        usuario={usuario}
      />


      <Carrito className="carro" carrito={carrito} updateCartItem={updateCartItem} show={showCart} onHide={() => setShowCart(false)} />

      <div className="container mt-4 flex-grow-1">
        <div className="row">
          {/* Contenido principal  Lado izquierdo */}
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

            {seccionActiva === "mi-cuenta" && (
              <MiCuenta usuario={usuario} recargarUsuario={recargarUsuario} />
            )}

            
            {seccionActiva === "anadir-producto" && usuario?.rol === "admin" && (
              <AnadirProducto addProduct={addProduct} isOnline={isOnline} recargarProductos={recargarProductos} />
            )}
            
            {seccionActiva === "editar-productos" && usuario?.rol === "admin" && (
              <EditarYBorrarProductos
                productos={initialProductos}
                addProduct={addProduct}
                isOnline={isOnline}
                recargarProductos={recargarProductos}
                borrarProducto={borrarProducto} 
              />
            )}

          
          {/* Formulario de login - Lado derecho */}
          <div className="col-md-4">
            <PanelLateral usuario={usuario} autenticado={autenticado} setAutenticado={setAutenticado} />
          </div>
        </div>
      </div>
      </div>
      <Pie id="pie" content="&copy; 2025 Nimbus Aviation. Todos los derechos reservados." />
    </>
  )
}

export default App