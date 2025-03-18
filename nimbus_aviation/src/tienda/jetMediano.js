import Producto from "./producto"

function JetMediano(nombre, precio, descripcion, imagen, num_pasajeros) {
  // Create the base product
  const producto = Producto(nombre, precio, descripcion, imagen)

  // Add private variable for num_pasajeros
  let _num_pasajeros = num_pasajeros

  // Return the enhanced object with jet-specific properties
  return {
    ...producto,
    tipo: "jetMediano",

    // Add getters and setters for num_pasajeros
    get num_pasajeros() {
      return _num_pasajeros
    },
    set num_pasajeros(value) {
      _num_pasajeros = value
    },
  }
}

// Add instanceof support
JetMediano.prototype = {}
export default JetMediano

