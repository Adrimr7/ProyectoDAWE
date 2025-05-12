import React, { useEffect, useState } from "react";
import Login from "./Login";
import UserPanel from "./UserPanel";

function PanelLateral() {
  const [autenticado, setAutenticado] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/comprobar-sesion", {
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => setAutenticado(data.autenticado));
  }, []);

  return autenticado ? <UserPanel /> : <Login />;
}

export default PanelLateral;
