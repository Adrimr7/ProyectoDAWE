import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase"; 

function Login({ onLogin }) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userCred = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      const idToken = await userCred.user.getIdToken();

      const res = await fetch("http://134.122.104.67:5000/usuarios/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      if (!res.ok) throw new Error("Error al iniciar sesión");

      await new Promise(resolve => setTimeout(resolve, 300));

      //Indicar al componente padre (App.js) que ya estamos autenticados
      onLogin(); 

    } catch (err) {
      setError("Credenciales incorrectas o error de conexión");
    }
  };

  return (
    <div className="card">
      <div className="card-header bg-primary text-white">
        <h4 className="mb-0">Acceso a la cuenta</h4>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          {error && <div className="alert alert-danger">{error}</div>}
          <div className="mb-3">
            <input 
              type="email" 
              className="form-control" 
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
      </div>
    </div>
  );
}

export default Login;