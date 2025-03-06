"use client"

function BuscadorProductos({ searchTerm, setSearchTerm, title, setCurrentPage }) {
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
    // Cuando se realiza una búsqueda, volvemos a la primera página
    setCurrentPage(1)
  }

  return (
    <div className="titulo-buscador mb-3">
      <h2 id="titulo">{title}</h2>
      <input
        type="text"
        id="buscador"
        className="form-control"
        placeholder="Buscar productos..."
        value={searchTerm}
        onChange={handleSearchChange}
      />
    </div>
  )
}

export default BuscadorProductos

