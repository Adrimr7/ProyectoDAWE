import Producto from "./producto"

function Helicoptero(nombre, precio, descripcion, imagen, facilidades) {
  // Create the base product
  const producto = Producto(nombre, precio, descripcion, imagen)

  // Add private variable for facilidades
  let _facilidades = facilidades

  // Return the enhanced object with helicoptero-specific properties
  return {
    ...producto,
    tipo: "helicoptero",

    // Add getters and setters for facilidades
    get facilidades() {
      return _facilidades
    },
    set facilidades(value) {
      _facilidades = value
    },
  }
}

// Add instanceof support
Helicoptero.prototype = {}
export default Helicoptero

