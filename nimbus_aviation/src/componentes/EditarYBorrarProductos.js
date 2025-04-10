"use client"

import { useState, useRef, useEffect } from "react"
import { FileUploader } from "react-drag-drop-files"
import { JetGrande, JetMediano, JetPequeno, Avioneta, Helicoptero } from "../tienda/tienda"
import { IMAGEN_POR_DEFECTO } from "../tienda/utils"
import Paginacion from "./Paginacion"
import DetallesProducto from "./DetallesProducto"
import carritoIcon from "../imagenes/carrito.png";
import { DIVISA } from "../tienda/tienda"

function EditarYBorrarProductos({editarProducto, borrarProducto, productos, isOnline}){
    //const [title, setTitle] = useState("Todos los productos")
    const [productoElegido, setProductoElegido] = useState(null);

    const convertToInternationalCurrencySystem = (labelValue) => {
        return Math.abs(Number(labelValue)) >= 1.0e6
          ? (Math.abs(Number(labelValue)) / 1.0e6).toFixed(2) + "M"
          : Math.abs(Number(labelValue)) >= 1.0e3
            ? (Math.abs(Number(labelValue)) / 1.0e3).toFixed(2) + "K"
            : Math.abs(Number(labelValue))
    }

    const handleEdit = (product) => {
      setProductoElegido(product);
      editarProducto(product);
    };

    const handleDelete = (productId) => {
      borrarProducto(productId);
    };

    const renderProductCard = (product) => {
        let extraInfo = ""
    
        return (
            <div className="d-flex align-items-center border-bottom py-2" key={product.id}>
              <input
                type="checkbox"
                className="form-check-input me-3"
                style={{ width: "18px", height: "18px" }}
              />
          
              <img
                src={product.imagen || "/placeholder.svg"}
                alt={product.nombre}
                className="me-3"
                style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "4px" }}
              />
          
              <div className="flex-grow-1">
                <span>{product.nombre}</span>
              </div>
          
              <a href={`/editar/${product.id}`} className="text-primary text-decoration-none ms-3">
                Editar
              </a>
            </div>
          );
    }
    return (
        <div id="jets-container" className="row">
            {productos.map((product) => renderProductCard(product))}
        </div>
    );
}

export default EditarYBorrarProductos