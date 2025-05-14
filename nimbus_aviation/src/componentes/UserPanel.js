import React from "react";
import { getAuth, signOut } from "firebase/auth";

function UserPanel({ onLogout, usuario }) {

  const handleLogout = async () => {
    const auth = getAuth();
    await signOut(auth);
    await fetch("http://localhost:5000/usuarios/logout", {
      method: "POST",
      credentials: "include",
    });
    await new Promise(resolve => setTimeout(resolve, 300));
    onLogout(); 
  };

  if (!usuario) return <p>Cargando usuario...</p>;

  return (
    <div className="card">
      <div className="card-header bg-success text-white">
        <h4>¡Hola!</h4>
      </div>
      <div className="card-body">
        <p><strong>Email:</strong> {usuario.email}</p>
        <p><strong>Rol:</strong> {usuario.rol || "Sin rol"}</p>
        <p><strong>Visitas:</strong> {usuario.visitas}</p>
        <button className="btn btn-secondary" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}

export default UserPanel;
