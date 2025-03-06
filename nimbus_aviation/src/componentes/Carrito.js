"use client"

function Carrito({ carrito, updateCartItem, show, onHide }) {
  const calculateTotal = () => {
    let total = 0
    for (const id in carrito) {
      total += carrito[id].precio * carrito[id].cantidad
    }
    return total
  }

  const handleQuantityChange = (id, cantidad) => {
    const newCantidad = Number.parseInt(cantidad)

    if (newCantidad >= 20) {
      const input = document.querySelector(`.cantidad-input[data-id="${id}"]`)
      const mensaje = input?.parentElement.querySelector(".mensaje-max")

      if (mensaje) {
        mensaje.classList.remove("d-none")

        setTimeout(() => {
          updateCartItem(id, 19) // Set to max - 1
          mensaje.classList.add("d-none")
        }, 2000)
      }

      return
    }

    updateCartItem(id, newCantidad)
  }

  return (
    <div
      className={`offcanvas offcanvas-start ${show ? "show" : ""}`}
      tabIndex="-1"
      id="carritoCanvas"
      style={{ visibility: show ? "visible" : "hidden" }}
    >
      <div className="offcanvas-header">
        <h5 className="offcanvas-title">Carrito de la compra</h5>
        <button type="button" className="btn-close" onClick={onHide}></button>
      </div>
      <div className="offcanvas-body">
        <div id="carrito" className="overflow-auto" style={{ maxHeight: "70vh" }}>
          {Object.keys(carrito).length === 0 ? (
            <p>No hay productos en el carrito</p>
          ) : (
            Object.entries(carrito).map(([id, { nombre, precio, cantidad, img }]) => (
              <div className="d-flex align-items-center mb-3" key={id}>
                <img src={img || "/placeholder.svg"} width="50" className="me-3" alt={nombre} />
                <div>
                  <h6>{nombre}</h6>
                  <p>${precio.toLocaleString()} c/u</p>
                  <input
                    type="number"
                    min="0"
                    max="21"
                    value={cantidad}
                    className="form-control w-50 cantidad-input"
                    data-id={id}
                    onChange={(e) => handleQuantityChange(id, e.target.value)}
                  />
                  <p>
                    Total: $<span className="item-total">{(precio * cantidad).toLocaleString()}</span>
                  </p>
                  <small className="text-danger mensaje-max d-none">Máximo alcanzado</small>
                </div>
              </div>
            ))
          )}
        </div>
        <h5 className="mt-3">
          Total: <span id="total">{calculateTotal().toLocaleString()}</span> $
        </h5>
      </div>
    </div>
  )
}

export default Carrito

