import React from "react"

function MenuNavegacion({ toggleCart, seccionActiva, cambiarSeccion, usuario }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark">
      <div className="container-fluid">
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <button 
                className={`nav-link btn btn-link ${seccionActiva === "inicio" ? "active" : ""}`} 
                onClick={() => cambiarSeccion("inicio")}
              >
                Inicio
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link btn btn-link ${seccionActiva === "mi-cuenta" ? "active" : ""}`} 
                onClick={() => cambiarSeccion("mi-cuenta")}
              >
                Mi cuenta
              </button>
            </li>
            {usuario?.rol === "admin" && (
              <>
                <li className="nav-item">
                  <button 
                    className={`nav-link btn btn-link ${seccionActiva === "anadir-producto" ? "active" : ""}`} 
                    onClick={() => cambiarSeccion("anadir-producto")}
                  >
                    Añadir un producto
                  </button>
                </li>
                <li className="nav-item">
                  <button 
                    className={`nav-link btn btn-link ${seccionActiva === "editar-productos" ? "active" : ""}`} 
                    onClick={() => cambiarSeccion("editar-productos")}
                  >
                    Editar/Borrar productos
                  </button>
                </li>
              </>
            )}
            
            <li className="nav-item">
              <button className="nav-link btn btn-link" onClick={toggleCart}>
                Carrito
              </button>
            </li>

          </ul>
        </div>
      </div>
    </nav>
  )
}

export default MenuNavegacion