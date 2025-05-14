import React from "react";
import Login from "./Login";
import UserPanel from "./UserPanel";

function PanelLateral({ usuario, autenticado, setAutenticado }) {
  return autenticado 
    ? <UserPanel usuario={usuario} onLogout={() => setAutenticado(false)} />
    : <Login onLogin={() => setAutenticado(true)} />;
}

export default PanelLateral;