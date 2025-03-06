"use client"

function MenuNavegacion({ toggleCart }) {
  return (
    <nav>
      <ul className="nav">
        <li className="nav-item">
          <a className="nav-link text-white" href="index.html">
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
  )
}

export default MenuNavegacion

