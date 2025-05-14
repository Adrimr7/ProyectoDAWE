import React from "react";
import Login from "./Login";
import UserPanel from "./UserPanel";

function PanelLateral({ autenticado, setAutenticado }) {
  return autenticado 
    ? <UserPanel onLogout={() => setAutenticado(false)} /> 
    : <Login onLogin={() => setAutenticado(true)} />;
}

export default PanelLateral;