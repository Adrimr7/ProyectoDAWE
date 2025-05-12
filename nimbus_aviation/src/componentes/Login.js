import React, { useState, useEffect } from "react";
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase"; 

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        setUserEmail(user.email);
      } else {
        setIsLoggedIn(false);
        setUserEmail("");
      }
    });

    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError("Por favor, complete todos los campos");
      return;
    }

    try {
      const userCred = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      const idToken = await userCred.user.getIdToken();

      // Llama a tu backend para crear sesión
      const res = await fetch("http://localhost:5000/usuarios/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken })
      });

      window.location.reload();

      if (!res.ok) {
        throw new Error("Error al iniciar sesión con el backend");
      }

      window.location.reload();

      setError("");

    } catch (err) {
      setError("Credenciales incorrectas o error de conexión");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const isOffline = !navigator.onLine;

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
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                disabled={isOffline}
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
                disabled={isOffline}
              />
            </div>

            <div className="d-grid">
              <button type="submit" className="btn btn-primary" disabled={isOffline}>
                Iniciar sesión
              </button>
            </div>
          </form>
        ) : null }
      </div>
    </div>
  );
}

export default Login;
