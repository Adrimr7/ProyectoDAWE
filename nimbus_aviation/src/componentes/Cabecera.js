"use client"

import MenuNavegacion from "./MenuNavegacion"

function Cabecera({ toggleCart, title = "Nimbus Aviation", isOnline }) {
  return (
    <header className="bg-dark text-white p-3 position-relative">
      {/* Título y navegación */}
      <div>
        <h1>{title}</h1>
        <MenuNavegacion toggleCart={toggleCart} />
      </div>

      {/* Mensaje "Estás offline" */}
      {!isOnline && (
        <div style={{
          position: 'absolute',
          top: '50%',
          right: '10px',
          transform: 'translateY(-50%)',
          backgroundColor: 'red',
          color: 'white',
          padding: '10px',
          border: '1px solid white',
          borderRadius: '5px',
          zIndex: 1000
        }}>
          Estás offline
        </div>
      )}
    </header>
  )
}

export default Cabecera