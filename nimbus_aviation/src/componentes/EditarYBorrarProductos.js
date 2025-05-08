"use client"

import { useState, useRef, useEffect } from "react"
import { FileUploader } from "react-drag-drop-files"
import { JetGrande, JetMediano, JetPequeno, Avioneta, Helicoptero } from "../tienda/tienda"
import { IMAGEN_POR_DEFECTO } from "../tienda/utils"
import Paginacion from "./Paginacion"
import DetallesProducto from "./DetallesProducto"
import carritoIcon from "../imagenes/carrito.png";
import { DIVISA } from "../tienda/tienda"

function EditarYBorrarProductos({borrarProducto, productos, isOnline}){
    const [productoElegido, setProductoElegido] = useState(null);
    const [productosModificados, setProductosModificados] = useState(productos)
    const [seleccionados, setSeleccionados] = useState([]);

    const convertToInternationalCurrencySystem = (labelValue) => {
        return Math.abs(Number(labelValue)) >= 1.0e6
          ? (Math.abs(Number(labelValue)) / 1.0e6).toFixed(2) + "M"
          : Math.abs(Number(labelValue)) >= 1.0e3
            ? (Math.abs(Number(labelValue)) / 1.0e3).toFixed(2) + "K"
            : Math.abs(Number(labelValue))
    }

    const editarProducto = (productoEditado) => {
      };

    const handleEdit = (product) => {
      setProductoElegido(product);
      editarProducto(product);
      // modificar la lista de productos con el/los editados o borrados
      setProductosModificados(productosModificados);
    };

    const handleDelete = (productId) => {
      borrarProducto(productId);
    };

    const setProductos = (prods) => {
        // todo
    }

    const renderProductCard = (product) => {
        return (
            <div className="d-flex item-list-row align-items-center py-1 px-2 border-bottom" key={product.id}
                style={{ fontSize: "0.95rem", minHeight: "65px"}}
                >
              <input
                type="checkbox"
                className="form-check-input me-4"
                checked={seleccionados.includes(product.id)}
                onChange={(e) => {
                  const { checked } = e.target;
                  setSeleccionados((prev) =>
                    checked ? [...prev, product.id] : prev.filter((id) => id !== product.id)
                  );
                }}
              />
              <img
                src={product.imagen || "/placeholder.svg"}
                alt={product.nombre}
                className="me-3"
                style={{ width: "64px", height: "40px", objectFit: "fill", borderRadius: "6px" }}
              />
              <div className="flex-grow-1">
                {product.nombre}
              </div>
              <button onClick={() => handleEdit(product)}
                className="btn btn-link text-primary p-0 m-0 ms-2"
                style={{ fontSize: "0.9rem", textDecoration: "underline", cursor: "pointer" }}
              >
              Editar
              </button>
            </div>
          );
    }
    
    return (
        <>
          {seleccionados.length > 0 && (
            <div className="mb-3">
              <button
                className="btn btn-danger"
                onClick={() => {
                  setProductosModificados((prev) =>
                    prev.filter((producto) => !seleccionados.includes(producto.id))
                  );
                  setSeleccionados([]);
                }}
              >
                Borrar seleccionados ({seleccionados.length})
              </button>
            </div>
          )}
      
          <div id="jets-container" className="row">
            {productosModificados.map((product) => renderProductCard(product))}
          </div>
        </>
      );
}

export default EditarYBorrarProductos