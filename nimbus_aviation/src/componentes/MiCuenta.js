import React, { useState } from "react"

function MiCuenta() {
  const [usuario, setUsuario] = useState({
    nombre: "Usuario",
    email: "usuario@example.com",
    direccion: "Calle Principal 123"
  })

  const [editando, setEditando] = useState(false)
  const [datos, setDatos] = useState({...usuario})

  const handleChange = (e) => {
    const { name, value } = e.target
    setDatos(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setUsuario(datos)
    setEditando(false)
  }

  return (
    <div id="mi-cuenta" className="container mt-4">
      <h2 className="mb-4">Mi cuenta</h2>
      
      {!editando ? (
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Información personal</h5>
            <p><strong>Nombre:</strong> {usuario.nombre}</p>
            <p><strong>Email:</strong> {usuario.email}</p>
            <p><strong>Dirección:</strong> {usuario.direccion}</p>
            <button 
              className="btn btn-primary" 
              onClick={() => setEditando(true)}
            >
              Editar información
            </button>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Editar información</h5>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="nombre" className="form-label">Nombre</label>
                <input 
                  type="text" 
                  className="form-control" 
                  id="nombre" 
                  name="nombre"
                  value={datos.nombre}
                  onChange={handleChange}
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
                  onChange={handleChange}
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
                />
              </div>
              <button type="submit" className="btn btn-success me-2">Guardar</button>
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => {
                  setEditando(false)
                  setDatos({...usuario})
                }}
              >
                Cancelar
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default MiCuenta