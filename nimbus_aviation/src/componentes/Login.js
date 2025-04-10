import React, { useState } from "react"

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validación básica
    if (!formData.email || !formData.password) {
      setError("Por favor, complete todos los campos");
      return;
    }
    
    // Aquí se implementaría la lógica real de autenticación
    if (formData.email === "usuario@example.com" && formData.password === "password") {
      setIsLoggedIn(true);
      setError("");
    } else {
      setError("Credenciales incorrectas");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setFormData({
      email: "",
      password: ""
    });
  };

  return (
    <div className="card">
      <div className="card-header bg-primary text-white">
        <h4 className="mb-0">Acceso a la cuenta</h4>
      </div>
      <div className="card-body">
        {!isLoggedIn ? (
          <form onSubmit={handleSubmit}>
            {error && <div className="alert alert-danger">{error}</div>}
            
            <div className="mb-3">
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
              />
            </div>
            
            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Contraseña"
              />
            </div>
            
            <div className="d-grid">
              <button type="submit" className="btn btn-primary">
                Iniciar sesión
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center">
            <h5 className="mb-3">¡Bienvenido!</h5>
            <p>Has iniciado sesión correctamente.</p>
            <button 
              className="btn btn-secondary" 
              onClick={handleLogout}
            >
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;