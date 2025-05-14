import React, { useState, useEffect } from "react";

function MiCuenta({ usuario }) {
  const [editando, setEditando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const isOffline = !navigator.onLine;
  const [datos, setDatos] = useState({
    nombre: "",
    direccion: "",
    telefono: "",
    fechaNacimiento: "",
    email: ""
  });

  useEffect(() => {
    if (usuario) {
      setDatos({
        nombre: usuario.nombre || "",
        direccion: usuario.direccion || "",
        telefono: usuario.telefono || "",
        fechaNacimiento: usuario.fechaNacimiento?.substring(0, 10) || "",
        email: usuario.email || ""
      });
    } else {
      setDatos({
        nombre: "",
        direccion: "",
        telefono: "",
        fechaNacimiento: "",
        email: ""
      });
    }
  }, [usuario]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setDatos(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!datos.nombre.trim()) {
      setError("El nombre no puede estar vacío");
      setTimeout(() => setError(""), 3000);
      return;
    }

    const res = await fetch(`http://localhost:5000/usuarios/${usuario.userId}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(datos)
    });

    if (res.ok) {
      setMensaje("Datos actualizados correctamente");
      setEditando(false);
      setTimeout(() => setMensaje(""), 3000);
    } else {
      setError("Error al actualizar");
      setTimeout(() => setError(""), 3000);
    }
  };



  return (
    <div id="mi-cuenta" className="col-md-8">
      <h2 className="mb-4">Mi cuenta</h2>
      {!editando ? (
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Información personal</h5>
            <p><strong>Nombre:</strong> {datos.nombre || "No disponible"}</p>
            <p><strong>Email:</strong> {datos.email || "No disponible"}</p>
            <p><strong>Dirección:</strong> {datos.direccion || "No disponible"}</p>
            <p><strong>Teléfono:</strong> {datos.telefono || "No disponible"}</p>
            <p><strong>Fecha de nacimiento:</strong> {datos.fechaNacimiento || "No disponible"}</p>                  
            <button className="btn btn-primary" onClick={() => setEditando(true)}>
              Editar información
            </button>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Editar información</h5>
            {mensaje && <div className="alert alert-success">{mensaje}</div>}
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
              {/* Campos del formulario */}
              <div className="mb-3">
                <label htmlFor="nombre" className="form-label">Nombre</label>
                <input
                  type="text"
                  className="form-control"
                  id="nombre"
                  name="nombre"
                  value={datos.nombre}
                  onChange={handleChange}
                  disabled={isOffline}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={datos.email}
                  disabled
                />
              </div>
              <div className="mb-3">
                <label htmlFor="direccion" className="form-label">Dirección</label>
                <input
                  type="text"
                  className="form-control"
                  id="direccion"
                  name="direccion"
                  value={datos.direccion}
                  onChange={handleChange}
                  disabled={isOffline}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="telefono" className="form-label">Teléfono</label>
                <input
                  type="tel"
                  className="form-control"
                  id="telefono"
                  name="telefono"
                  value={datos.telefono}
                  onChange={handleChange}
                  disabled={isOffline}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="fechaNacimiento" className="form-label">Fecha de nacimiento</label>
                <input
                  type="date"
                  className="form-control"
                  id="fechaNacimiento"
                  name="fechaNacimiento"
                  value={datos.fechaNacimiento}
                  onChange={handleChange}
                  disabled={isOffline}
                />
              </div>
              <button type="submit" className="btn btn-success me-2" disabled={!usuario}>
                Guardar
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => {
                setEditando(false);
                setDatos({
                  nombre: usuario?.nombre || "",
                  direccion: usuario?.direccion || "",
                  telefono: usuario?.telefono || "",
                  fechaNacimiento: usuario?.fechaNacimiento?.substring(0, 10) || "",
                  email: usuario?.email || ""
                });
              }}>
                Cancelar
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default MiCuenta;
