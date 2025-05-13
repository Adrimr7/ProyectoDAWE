import React from "react"
import FormularioNuevosProductos from "./FormularioNuevosProductos"

function AnadirProducto({ addProduct, isOnline, recargarProductos }) {
  return (
    <div id="anadir-producto" className="col-md-8">
      <div className="card">
        <div className="card-header bg-primary text-white">
          <h2 className="mb-0 text-center">Formulario para agregar productos</h2>
        </div>
        <div className="card-body">
          <FormularioNuevosProductos addProduct={addProduct} isOnline={isOnline} recargarProductos={recargarProductos} />
        </div>
      </div>
    </div>
  )
}

export default AnadirProducto