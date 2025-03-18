import { guidGenerator, IMAGEN_POR_DEFECTO } from "./utils"

function Producto(nombre, precio, descripcion = "Sin descripción", imagen = null) {
  // Using closures to maintain private variables
  const id = guidGenerator()
  let _nombre = nombre
  let _precio = precio
  let _descripcion = descripcion
  let _imagen = imagen || IMAGEN_POR_DEFECTO

  // Return the public interface
  return {
    // Getters
    get id() {
      return id
    },
    get nombre() {
      return _nombre
    },
    get precio() {
      return _precio
    },
    get descripcion() {
      return _descripcion
    },
    get imagen() {
      return _imagen
    },

    // Setters
    set nombre(value) {
      _nombre = value
    },
    set precio(value) {
      _precio = value
    },
    set descripcion(value) {
      _descripcion = value
    },
    set imagen(value) {
      _imagen = value || IMAGEN_POR_DEFECTO
    },
  }
}

export default Producto

