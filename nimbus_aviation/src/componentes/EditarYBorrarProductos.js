"use client"

import { useState, useRef, useEffect } from "react"


function EditarYBorrarProductos({borrarProducto, productos, isOnline}){
    const [productosModificados, setProductosModificados] = useState([]);
    const [seleccionados, setSeleccionados] = useState([]);
    const [editandoId, setEditandoId] = useState(null);
    const [formData, setFormData] = useState({});


    useEffect(() => {
      fetch("http://localhost:5000/productos", { credentials: "include" })
        .then(res => res.ok ? res.json() : [])
        .then(data => setProductosModificados(data));
    }, []);


    const convertToInternationalCurrencySystem = (labelValue) => {
        return Math.abs(Number(labelValue)) >= 1.0e6
          ? (Math.abs(Number(labelValue)) / 1.0e6).toFixed(2) + "M"
          : Math.abs(Number(labelValue)) >= 1.0e3
            ? (Math.abs(Number(labelValue)) / 1.0e3).toFixed(2) + "K"
            : Math.abs(Number(labelValue))
    }


    const handleEdit = (product) => {
      setEditandoId(product._id);
      setFormData({
        nombre: product.nombre,
        precio: product.precio,
        descripcion: product.descripcion,
        extra: product.extra,
        imagen: product.imagen
      });
    };


    const handleDelete = (productId) => {
      borrarProducto(productId);
    };

    const setProductos = (prods) => {
        // todo
    }

    const guardarCambios = async (e, id) => {
      e.preventDefault();

      const res = await fetch(`http://localhost:5000/productos/${id}`, {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        });
      
        if (res.ok) {
          const actualizados = productosModificados.map(p =>
            p._id === id ? { ...p, ...formData } : p
          );
          setProductosModificados(actualizados);
          setEditandoId(null);
        }
      };


    const borrarSeleccionados = async () => {
      const res = await fetch("http://localhost:5000/productos/eliminar", {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: seleccionados })
      });
    
      if (res.ok) {
        setProductosModificados(prev => prev.filter(p => !seleccionados.includes(p._id)));
        setSeleccionados([]);
      }
    };


    const renderProductCard = (product) => {
        return (
            <div className="d-flex item-list-row align-items-center py-1 px-2 border-bottom" key={product._id}
                style={{ fontSize: "0.95rem", minHeight: "65px"}}
                >
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
                src={product.imagen || "/placeholder.svg"}
                alt={product.nombre}
                className="me-3"
                style={{ width: "64px", height: "40px", objectFit: "fill", borderRadius: "6px" }}
              />
              <div className="flex-grow-1">
                {product.nombre}
              </div>
              <button onClick={() => handleEdit(product)}
                className="btn btn-link text-primary p-0 m-0 ms-2"
                style={{ fontSize: "0.9rem", textDecoration: "underline", cursor: "pointer" }}
              >
              Editar
              </button>
              {product._id === editandoId && (
                <form onSubmit={(e) => guardarCambios(e, product._id)} className="w-100 mt-3">
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
                    type="text"
                    name="imagen"
                    placeholder="Ruta de imagen"
                    className="form-control mb-2"
                    value={formData.imagen || ""}
                    onChange={(e) => setFormData({ ...formData, imagen: e.target.value })}
                    disabled={!isOnline}
                  />
                  <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-success btn-sm" disabled={!isOnline}>
                      Guardar cambios
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => setEditandoId(null)}
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              )}

            </div>
          );
    }
    
    return (
        <>
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
        </>
      );
}

export default EditarYBorrarProductos