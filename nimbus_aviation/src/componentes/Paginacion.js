"use client"

function Paginacion({ currentPage, totalPages, onPageChange, totalProducts, productsPerPage }) {
  // Calcular el rango de productos que se están mostrando actualmente
  const startProduct = totalProducts === 0 ? 0 : (currentPage - 1) * productsPerPage + 1
  const endProduct = Math.min(currentPage * productsPerPage, totalProducts)

  if (totalPages <= 0) return null

  return (
    <div id="paginacion" className="text-center mt-4">
      <div className="mb-2">
        Mostrando productos {startProduct} a {endProduct} de {totalProducts}
      </div>

      {currentPage > 1 && (
        <button className="btn btn-secondary me-2" onClick={() => onPageChange(currentPage - 1)}>
          Anterior
        </button>
      )}

      {[...Array(totalPages)].map((_, i) => (
        <button
          key={i + 1}
          className={`btn me-1 ${i + 1 === currentPage ? "btn-primary" : "btn-outline-primary"}`}
          onClick={() => onPageChange(i + 1)}
        >
          {i + 1}
        </button>
      ))}

      {currentPage < totalPages && (
        <button className="btn btn-secondary" onClick={() => onPageChange(currentPage + 1)}>
          Siguiente
        </button>
      )}
    </div>
  )
}

export default Paginacion

