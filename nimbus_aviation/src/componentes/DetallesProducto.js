"use client"
import { JetGrande, JetMediano, JetPequeno, Avioneta, Helicoptero } from "../tienda/tienda"

function DetallesProducto({ product, show, onHide }) {
  if (!product || !show) return null

  let extraInfo = ""
  if (product instanceof JetGrande || product instanceof JetMediano || product instanceof JetPequeno) {
    extraInfo = (
      <p>
        <strong>Pasajeros:</strong> {product.num_pasajeros} pax
      </p>
    )
  } else if (product instanceof Avioneta) {
    extraInfo = (
      <p>
        <strong>Alcance:</strong> {product.alcance} km
      </p>
    )
  } else if (product instanceof Helicoptero) {
    extraInfo = (
      <p>
        <strong>Facilidades:</strong> {product.facilidades.join(", ")}
      </p>
    )
  }

  return (
    <div
      className="modal fade show"
      id="productModal"
      tabIndex="-1"
      aria-labelledby="productModalLabel"
      aria-hidden="true"
      style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <button type="button" className="btn-close" onClick={onHide} aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <div className="row">
              <div className="col-md-6">
                <img
                  id="modalImage"
                  src={product.imagen || "/placeholder.svg"}
                  className="img-fluid"
                  alt={product.nombre}
                />
              </div>
              <div className="col-md-6">
                <h5 className="modal-title" id="productModalLabel">
                  Producto
                </h5>
                <h5 id="modalProductName">{product.nombre}</h5>
                <p id="modalDescription" className="mt-3">
                  {product.descripcion}
                </p>
                <p id="modalPrice" className="mt-3">
                  <strong>Precio:</strong> ${product.precio.toLocaleString()}
                </p>
                <div id="modalAttributes">{extraInfo}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DetallesProducto

