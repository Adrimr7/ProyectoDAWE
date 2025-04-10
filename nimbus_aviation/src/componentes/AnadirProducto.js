import React from "react"
import FormularioNuevosProductos from "./FormularioNuevosProductos"

function AnadirProducto({ addProduct, isOnline }) {
  return (
    <div id="anadir-producto" className="container mt-4">
      <h2 className="mb-4">Añadir un producto</h2>
      <div className="card">
        <div className="card-body">
          <FormularioNuevosProductos addProduct={addProduct} isOnline={isOnline} />
        </div>
      </div>
    </div>
  )
}

export default AnadirProducto