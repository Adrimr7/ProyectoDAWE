import MenuNavegacion from "./MenuNavegacion"

function Cabecera({ toggleCart, title = "Nimbus Aviation" }) {
  return (
    <header className="bg-dark text-white p-3">
      <h1>{title}</h1>
      <MenuNavegacion toggleCart={toggleCart} />
    </header>
  )
}

export default Cabecera

