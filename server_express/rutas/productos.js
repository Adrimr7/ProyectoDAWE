import { Router } from 'express';
import { ObjectId } from 'mongodb';
import multer from "multer";
import path from "path";


const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "public/uploads"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });


const router = Router();

// Middleware para rutas sólo administradores
function soloAdmin(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'No autenticado' });
  }
  if (req.session.rol !== 'admin') {
    return res.status(403).json({ error: 'No autorizado' });
  }
  next();
}

// GET /api/productos
router.get('/', async (req, res) => {
  try {
    const productos = await req.app.locals.db
      .collection('productos')
      .find()
      .toArray();
    res.json(productos);
  } catch (err) {
    console.error('Error en GET /productos:', err);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

// POST /api/productos (admin)
router.post("/", soloAdmin, upload.single("imagen"), async (req, res) => {
  try {
    const { tipo, nombre, precio, descripcion, extra } = req.body;
    const imagen = req.file ? `uploads/${req.file.filename}` : "imagenes/no-image.png";

    if (!nombre || !precio || !descripcion) {
      return res.status(400).json({ error: "Faltan campos obligatorios." });
    }

    const nuevoProducto = {
      tipo,
      nombre,
      precio: parseFloat(precio),
      descripcion,
      imagen
    };

    // Interpretar campo extra según tipo
    if (extra) {
      if (["Jet Grande", "Jet Mediano", "Jet Pequeño"].includes(tipo)) {
        nuevoProducto.num_pasajeros = parseInt(extra);
      } else if (tipo === "Avioneta") {
        nuevoProducto.alcance_km = parseFloat(extra);
      } else if (tipo === "Helicóptero") {
        nuevoProducto.facilidades = extra.split(",").map(f => f.trim());
      }
    }

    const db = req.app.locals.db;
    await db.collection("productos").insertOne(nuevoProducto);

    res.status(201).json(nuevoProducto);
  } catch (err) {
    console.error("Error al crear producto:", err);
    res.status(500).json({ error: "Error interno al crear producto." });
  }
});



// PUT /api/productos/:id (admin)
router.put('/:id', soloAdmin, upload.single("imagen"), async (req, res) => {
  const { id } = req.params;
  const { tipo, nombre, precio, descripcion, extra } = req.body;

  if (!nombre || !precio || !descripcion) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  try {
    const update = {
      tipo,
      nombre,
      precio: parseFloat(precio),
      descripcion
    };

    if (req.file) {
      update.imagen = `uploads/${req.file.filename}`;
    } else if (req.body.imagen) {
      update.imagen = req.body.imagen;
    }

    // Interpretar campo extra según tipo
    if (extra) {
      if (["Jet Grande", "Jet Mediano", "Jet Pequeño"].includes(tipo)) {
        update.num_pasajeros = parseInt(extra);
        update.alcance_km = undefined;
        update.facilidades = undefined;
      } else if (tipo === "Avioneta") {
        update.alcance_km = parseFloat(extra);
        update.num_pasajeros = undefined;
        update.facilidades = undefined;
      } else if (tipo === "Helicóptero") {
        update.facilidades = extra.split(",").map(f => f.trim());
        update.num_pasajeros = undefined;
        update.alcance_km = undefined;
      }
    }

    const result = await req.app.locals.db
      .collection('productos')
      .updateOne({ _id: new ObjectId(id) }, { $set: update });

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json({ actualizado: { _id: id, ...update } });
  } catch (err) {
    console.error('Error en PUT /productos/:id:', err);
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
});


// DELETE /api/productos/:id (admin)
router.delete('/:id', soloAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await req.app.locals.db
      .collection('productos')
      .deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json({ message: 'Producto eliminado' });
  } catch (err) {
    console.error('Error en DELETE /productos/:id:', err);
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
});

// DELETE /api/productos (admin) – borrado múltiple
router.delete('/', soloAdmin, async (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ error: 'IDs inválidos' });
  }
  try {
    const objectIds = ids.map((id) => new ObjectId(id));
    const result = await req.app.locals.db
      .collection('productos')
      .deleteMany({ _id: { $in: objectIds } });
    res.json({ deletedCount: result.deletedCount });
  } catch (err) {
    console.error('Error en DELETE /productos:', err);
    res.status(500).json({ error: 'Error al eliminar productos' });
  }
});

export default router;
