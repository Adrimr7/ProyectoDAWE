"use client"

import { useState, useRef } from "react"
import { FileUploader } from "react-drag-drop-files"
import { JetGrande, JetMediano, JetPequeno, Avioneta, Helicoptero } from "../tienda/tienda"
import { IMAGEN_POR_DEFECTO } from "../tienda/utils"

function FormularioNuevosProductos({ addProduct, isOnline, recargarProductos }) {
  const [tipo, setTipo] = useState("Jet Grande")
  const [nombre, setNombre] = useState("")
  const [precio, setPrecio] = useState("")
  const [descripcion, setDescripcion] = useState("")
  const [extra, setExtra] = useState("")
  const [imagen, setImagen] = useState(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");


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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!nombre || !precio || !descripcion) {
      setError("Por favor, completa todos los campos obligatorios.");
      return;
    }
  
    const formData = new FormData();
    formData.append("tipo", tipo);
    formData.append("nombre", nombre);
    formData.append("precio", precio);
    formData.append("descripcion", descripcion);
    if (imagen) formData.append("imagen", imagen);
    formData.append("extra", extra);
  
    try {
      const respuesta = await fetch("http://localhost:5000/productos", {
        method: "POST",
        credentials: "include",
        body: formData
      });
    
      if (respuesta.ok) {
        const creado = await respuesta.json();
        addProduct(creado);
        recargarProductos();
        setMensaje("Producto añadido correctamente.");
        setTipo("Jet Grande");
        setNombre("");
        setPrecio("");
        setDescripcion("");
        setExtra("");
        setImagen(null);
        setTimeout(() => setMensaje(""), 3000);
      } else {
        const textoError = await respuesta.text();
        console.error("Error desde el backend:", textoError);
        setError("Error al añadir el producto.");
        setTimeout(() => setError(""), 3000);
      }
    } catch (err) {
      setError("Error de conexión con el servidor.");
      setTimeout(() => setError(""), 3000);
    }
  };




  return (
    <div className="w-100">
      {mensaje && <div className="alert alert-success">{mensaje}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <form id="formulario-jet" onSubmit={handleSubmit} className="mx-auto" style={{ maxWidth: '95%' }}>
        <div className="mb-3">
          <select
            id="tipoJet"
            className="form-control form-control-lg"
            value={tipo}
            onChange={handleTipoChange}
            disabled={!isOnline}
          >
            <option value="">Selecciona un tipo</option>
            <option value="Jet Grande">Jet Grande</option>
            <option value="Jet Mediano">Jet Mediano</option>
            <option value="Jet Pequeño">Jet Pequeño</option>
            <option value="Avioneta">Avioneta</option>
            <option value="Helicóptero">Helicóptero</option>
          </select>
        </div>

        <div className="mb-3">
          <input
            type="text"
            id="nombre"
            className="form-control form-control-lg"
            placeholder="Nombre del producto"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            disabled={!isOnline}
          />
        </div>

        <div className="mb-3">
          <input
            type="number"
            id="precio"
            className="form-control form-control-lg"
            placeholder="Precio ($)"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            disabled={!isOnline}
          />
        </div>

        <div className="mb-3">
          <textarea
            id="descripcion"
            className="form-control form-control-lg"
            placeholder="Descripción"
            rows="4"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            disabled={!isOnline}
          />
        </div>

        <div className="mb-3">
          <input
            type="text"
            id="extra"
            className="form-control form-control-lg"
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
            disabled={!isOnline}
          />
        </div>

        <div className="mb-3">
          <input
            type="file"
            id="imagenJet"
            className="form-control form-control-lg"
            onChange={handleFileInputChange}
            ref={fileInputRef}
            disabled={!isOnline}
          />
        </div>

        <div className="mb-3">
          <div id="mi-file-uploader">
            <FileUploader
              id="mi-file-uploader"
              handleChange={handleFileChange}
              name="imagenJet"
              label=" "
              hoverTitle="Suelta la imagen"
              maxSize={5}
              disabled={!isOnline}
            />
          </div>
          {imagen && <p className="mt-2">Archivo seleccionado: {imagen.name}</p>}
        </div>

        <div className="text-center mb-3">
          <button type="submit" className="btn btn-primary btn-lg px-5" disabled={!isOnline}>
            Agregar Producto
          </button>
        </div>
      </form>

      <div id="mensaje-exito" className={`alert alert-success mt-3 ${showSuccess ? "" : "d-none"}`} role="alert">
        Producto añadido con éxito!
      </div>
    </div>
  )
}

export default FormularioNuevosProductos