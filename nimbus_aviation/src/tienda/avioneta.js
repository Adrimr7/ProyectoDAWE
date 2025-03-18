import Producto from "./producto"

function Avioneta(nombre, precio, descripcion, imagen, alcance) {
  // Create the base product
  const producto = Producto(nombre, precio, descripcion, imagen)

  // Add private variable for alcance
  let _alcance = alcance

  // Return the enhanced object with avioneta-specific properties
  return {
    ...producto,

    // Add getters and setters for alcance
    get alcance() {
      return _alcance
    },
    set alcance(value) {
      _alcance = value
    },
  }
}

// Add instanceof support
Avioneta.prototype = {}
export default Avioneta

