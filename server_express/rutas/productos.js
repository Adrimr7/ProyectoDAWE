import express from "express";
import { connect, Schema, model } from "mongoose";
import json from "body-parser";
import cors from "cors";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(json());

connect("mongodb://localhost:27017/tienda", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

const productoSchema = new Schema({
  id: { type: String, required: true, unique: true },
  nombre: String,
  imagen: String,
  precio: Number,
  descripcion: String,
  tipo: { type: String, enum: ['JetGrande', 'JetMediano', 'JetPequeno', 'Avioneta', 'Helicoptero'] },
  extra: {
    type: Map,
    of: String,
  },
});
// se usa extra para poder tener "alcance": "3000" o lo relativo

const Producto = model("Producto", productoSchema);

app.get("/api/productos", async (req, res) => {
  const products = await Producto.find();
  res.json(products);
});

app.post("/api/productos", async (req, res) => {

  const camposPermitidos = {
      JetGrande: "num_pasajeros",
      JetMediano: "num_pasajeros",
      JetPequeno: "num_pasajeros",
      Avioneta: "alcance",
      Helicoptero: "facilidades",
    };
  const claveExtra = Object.keys(extra || {});
  if (claveExtra.length !== 1 || claveExtra[0] !== camposPermitidos[tipo]) {
    return res.status(400).json({
      error: `El campo extra para el tipo "${tipo}" debe ser "${camposPermitidos[tipo]}"`,
    });
  }

  const productoNuevo = new Producto(req.body);
  await productoNuevo.save();
  res.json(productoNuevo);
});

app.delete("/api/productos/:id", async (req, res) => {
  const { id } = req.params;
  await Producto.findByIdAndDelete(id);
  res.json({ message: "Producto deleted" });
});

app.put("/api/productos/:id", async (req, res) => {
  const { id } = req.params;
  const updatedProduct = await Producto.findByIdAndUpdate(id, req.body, { new: true });
  res.json(updatedProduct);
});

// Start Server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));