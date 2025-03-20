"use client"

import { useState, useRef } from "react"
import { FileUploader } from "react-drag-drop-files"
import { JetGrande, JetMediano, JetPequeno, Avioneta, Helicoptero } from "../tienda/tienda"
import { IMAGEN_POR_DEFECTO } from "../tienda/utils"

function FormularioNuevosProductos({ addProduct, isOnline }) {
  const [tipo, setTipo] = useState("Jet Grande")
  const [nombre, setNombre] = useState("")
  const [precio, setPrecio] = useState("")
  const [descripcion, setDescripcion] = useState("")
  const [extra, setExtra] = useState("")
  const [imagen, setImagen] = useState(null)
  const [showSuccess, setShowSuccess] = useState(false)

  const fileInputRef = useRef(null)

  const fileTypes = ["JPG", "PNG", "GIF", "JPEG"]

  const handleTipoChange = (e) => {
    setTipo(e.target.value)
  }

  const handleFileChange = (file) => {
    setImagen(file)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleFileInputChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImagen(file)
    } else {
      setImagen(null)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!tipo || !nombre || isNaN(Number.parseFloat(precio)) || !extra) {
      alert("Por favor, rellena todos los campos obligatorios.")
      return
    }

    const precioNum = Number.parseFloat(precio)
    const imagenUrl = imagen ? URL.createObjectURL(imagen) : IMAGEN_POR_DEFECTO

    let nuevoProducto

    if (tipo === "Jet Grande" || tipo === "Jet Mediano" || tipo === "Jet Pequeño") {
      const numPasajeros = Number.parseInt(extra)
      if (isNaN(numPasajeros)) {
        alert("Por favor, ingresa un número válido para el número de pasajeros.")
        return
      }

      if (tipo === "Jet Grande") {
        nuevoProducto = new JetGrande(nombre, precioNum, descripcion, imagenUrl, numPasajeros)
      } else if (tipo === "Jet Mediano") {
        nuevoProducto = new JetMediano(nombre, precioNum, descripcion, imagenUrl, numPasajeros)
      } else if (tipo === "Jet Pequeño") {
        nuevoProducto = new JetPequeno(nombre, precioNum, descripcion, imagenUrl, numPasajeros)
      }
    } else if (tipo === "Avioneta") {
      const alcanceKm = Number.parseFloat(extra)
      if (isNaN(alcanceKm)) {
        alert("Por favor, ingresa un número válido para el alcance en km.")
        return
      }
      nuevoProducto = new Avioneta(nombre, precioNum, descripcion, imagenUrl, alcanceKm)
    } else if (tipo === "Helicóptero") {
      const facilidades = extra
        .split(",")
        .map((f) => f.trim())
        .filter((f) => f !== "")
      if (facilidades.length === 0) {
        alert("Por favor, ingresa al menos una facilidad.")
        return
      }
      nuevoProducto = new Helicoptero(nombre, precioNum, descripcion, imagenUrl, facilidades)
    } else {
      alert("Tipo de producto no válido")
      return
    }

    addProduct(nuevoProducto)

    setNombre("")
    setPrecio("")
    setDescripcion("")
    setExtra("")
    setImagen(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }

    setShowSuccess(true)
    setTimeout(() => {
      setShowSuccess(false)
    }, 2000)
  }

  return (
    <aside className="col-md-4 mt-4">
      <h2>Agregar un Producto</h2>
      <form id="formulario-jet" onSubmit={handleSubmit}>
        <div className="mb-2">
          <select
            id="tipoJet"
            className="form-control"
            value={tipo}
            onChange={handleTipoChange}
            disabled={!isOnline} // Deshabilitar si está offline
          >
            <option value="">Selecciona un tipo</option>
            <option value="Jet Grande">Jet Grande</option>
            <option value="Jet Mediano">Jet Mediano</option>
            <option value="Jet Pequeño">Jet Pequeño</option>
            <option value="Avioneta">Avioneta</option>
            <option value="Helicóptero">Helicóptero</option>
          </select>
        </div>

        <div className="mb-2">
          <input
            type="text"
            id="nombre"
            className="form-control"
            placeholder="Nombre del producto"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            disabled={!isOnline} // Deshabilitar si está offline
          />
        </div>

        <div className="mb-2">
          <input
            type="number"
            id="precio"
            className="form-control"
            placeholder="Precio ($)"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            disabled={!isOnline} // Deshabilitar si está offline
          />
        </div>

        <div className="mb-2">
          <textarea
            id="descripcion"
            className="form-control"
            placeholder="Descripción"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            disabled={!isOnline} // Deshabilitar si está offline
          />
        </div>

        <div className="mb-2">
          <input
            type="text"
            id="extra"
            className="form-control"
            placeholder={
              tipo === "Jet Grande" || tipo === "Jet Mediano" || tipo === "Jet Pequeño"
                ? "Número de pasajeros"
                : tipo === "Avioneta"
                  ? "Alcance en kilómetros"
                  : tipo === "Helicóptero"
                    ? "Facilidades (separadas por comas)"
                    : "Atributo extra (cambia dependiendo del tipo)"
            }
            value={extra}
            onChange={(e) => setExtra(e.target.value)}
            disabled={!isOnline} // Deshabilitar si está offline
          />
        </div>

        <div className="mb-2">
          <input
            type="file"
            id="imagenJet"
            className="form-control"
            onChange={handleFileInputChange}
            ref={fileInputRef}
            disabled={!isOnline} // Deshabilitar si está offline
          />
        </div>

        <div className="mb-2">
          <FileUploader
            handleChange={handleFileChange}
            name="imagenJet"
            label=" "
            hoverTitle="Suelta la imagen"
            maxSize={5}
            disabled={!isOnline} // Deshabilitar si está offline
          />
          {imagen && <p className="mt-2">Archivo seleccionado: {imagen.name}</p>}
        </div>

        <button type="submit" className="btn btn-primary" disabled={!isOnline}>
          Agregar Producto
        </button>
      </form>

      <div id="mensaje-exito" className={`alert alert-success mt-3 ${showSuccess ? "" : "d-none"}`} role="alert">
        Producto añadido con éxito!
      </div>
    </aside>
  )
}

export default FormularioNuevosProductos