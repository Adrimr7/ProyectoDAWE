"use client"

import { useState, useEffect } from "react"
import { FileUploader } from "react-drag-drop-files";

function EditarYBorrarProductos({ borrarProducto, productos, isOnline, recargarProductos }) {
  const [productosModificados, setProductosModificados] = useState([]);
  const [seleccionados, setSeleccionados] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetch("http://localhost:5000/productos", { credentials: "include" })
      .then(res => res.ok ? res.json() : [])
      .then(data => setProductosModificados(data));
  }, []);

  const handleEdit = (product) => {
    setEditandoId(product._id);
    setFormData({
      nombre: product.nombre,
      precio: product.precio,
      descripcion: product.descripcion,
      extra: product.extra,
      tipo: product.tipo,
      imagen: product.imagen,
      imagenArchivo: null
    });
  };

  const guardarCambios = async (e, id) => {
    e.preventDefault();

    let payload;
    let headers;

    if (formData.imagenArchivo) {
      payload = new FormData();
      payload.append("nombre", formData.nombre);
      payload.append("precio", formData.precio);
      payload.append("descripcion", formData.descripcion);
      payload.append("extra", formData.extra);
      payload.append("tipo", formData.tipo);
      payload.append("imagen", formData.imagenArchivo);
    } else {
      payload = JSON.stringify({
        nombre: formData.nombre,
        precio: formData.precio,
        descripcion: formData.descripcion,
        extra: formData.extra,
        tipo: formData.tipo,
        imagen: formData.imagen
      });
      headers = { "Content-Type": "application/json" };
    }

    const res = await fetch(`http://localhost:5000/productos/${id}`, {
      method: "PUT",
      credentials: "include",
      headers,
      body: payload
    });

    if (res.ok) {
      const { actualizado } = await res.json();
      const actualizados = productosModificados.map(p =>
        p._id === id ? { ...p, ...actualizado } : p
      );
      setProductosModificados(actualizados);
      setEditandoId(null);
      if (recargarProductos) recargarProductos();
    }
  };

  const borrarSeleccionados = async () => {
    const res = await fetch("http://localhost:5000/productos", {
      method: "DELETE",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: seleccionados })
    });

    if (res.ok) {
      seleccionados.forEach(id => borrarProducto(id));
      setProductosModificados(prev => prev.filter(p => !seleccionados.includes(p._id)));
      setSeleccionados([]);
      if (recargarProductos) recargarProductos(); 
    }
  };

  const renderProductCard = (product) => (
    <div className="d-flex item-list-row align-items-center py-1 px-2 border-bottom" key={product._id} style={{ fontSize: "0.95rem", minHeight: "65px" }}>
      <input
        type="checkbox"
        className="form-check-input me-4"
        checked={seleccionados.includes(product._id)}
        onChange={(e) => {
          const { checked } = e.target;
          setSeleccionados((prev) =>
            checked ? [...prev, product._id] : prev.filter((id) => id !== product._id)
          );
        }}
      />
      <img
        src={
          product.imagen?.startsWith("http")
            ? product.imagen
            : `http://localhost:5000/${product.imagen}`
        }
        alt={product.nombre}
        className="me-3"
        style={{ width: "64px", height: "40px", objectFit: "fill", borderRadius: "6px" }}
      />
      <div className="flex-grow-1">
        {product.nombre}
      </div>
      {product._id !== editandoId && (
        <button
          onClick={() => handleEdit(product)}
          className="btn btn-link text-primary p-0 m-0 ms-2"
          style={{ fontSize: "0.9rem", textDecoration: "underline", cursor: "pointer" }}
        >
          Editar
        </button>
      )}  


      {product._id === editandoId && (
        <form onSubmit={(e) => guardarCambios(e, product._id)} className="w-100 mt-3">
          <div className="justify-content-end">
            <button
              type="button"
              onClick={() => setEditandoId(null)}
              className="btn btn-link text-danger p-0 m-0 mb-2"
              style={{ fontSize: "0.9rem", textDecoration: "underline", cursor: "pointer" }}
            >
              Cerrar 
            </button>
          </div>

          <select className="form-control mb-2" disabled value={formData.tipo || ""}>
            <option value="Jet Grande">Jet Grande</option>
            <option value="Jet Mediano">Jet Mediano</option>
            <option value="Jet Pequeño">Jet Pequeño</option>
            <option value="Avioneta">Avioneta</option>
            <option value="Helicóptero">Helicóptero</option>
          </select>

          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            className="form-control mb-2"
            value={formData.nombre || ""}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            disabled={!isOnline}
          />

          <input
            type="number"
            name="precio"
            placeholder="Precio"
            className="form-control mb-2"
            value={formData.precio || ""}
            onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
            disabled={!isOnline}
          />

          <textarea
            name="descripcion"
            placeholder="Descripción"
            className="form-control mb-2"
            value={formData.descripcion || ""}
            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
            disabled={!isOnline}
          />

          <input
            type="text"
            name="extra"
            placeholder="Campo extra"
            className="form-control mb-2"
            value={formData.extra || ""}
            onChange={(e) => setFormData({ ...formData, extra: e.target.value })}
            disabled={!isOnline}
          />

          <input
            type="file"
            className="form-control mb-2"
            onChange={(e) => setFormData({ ...formData, imagenArchivo: e.target.files[0] })}
            disabled={!isOnline}
          />

          <FileUploader
            handleChange={(file) => setFormData({ ...formData, imagenArchivo: file })}
            name="imagenJet"
            label=" "
            hoverTitle="Suelta la imagen aqui"
            maxSize={5}
            disabled={!isOnline}
          />

          {formData.imagenArchivo && (
            <p className="mt-2">Archivo seleccionado: {formData.imagenArchivo.name}</p>
          )}

          <div className="mt-2">
            <button type="submit" className="btn btn-success btn-sm" disabled={!isOnline}>
              Guardar cambios
            </button>
          </div>

        </form>
      )}
    </div>
  );

  return (
    <div id="editar-productos" className="col-md-8">
      {seleccionados.length > 0 && (
        <div className="mb-3">
          <button
            className="btn btn-danger"
            onClick={borrarSeleccionados}
            disabled={!isOnline}
          >
            Borrar seleccionados ({seleccionados.length})
          </button>
        </div>
      )}

      <div id="jets-container" className="row">
        {productosModificados.map((product) => renderProductCard(product))}
      </div>
    </div>
  );

}

export default EditarYBorrarProductos;
