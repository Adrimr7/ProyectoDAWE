import { Router } from 'express';
import { ObjectId } from 'mongodb';

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
router.post('/', soloAdmin, async (req, res) => {
  const { tipo, nombre, precio, descripcion, imagen, stock } = req.body;
  if (!nombre || typeof precio !== 'number') {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }
  try {
    const nuevo = { tipo, nombre, precio, descripcion, imagen, stock: stock || 0 };
    const result = await req.app.locals.db
      .collection('productos')
      .insertOne(nuevo);
    res.status(201).json({ _id: result.insertedId, ...nuevo });
  } catch (err) {
    console.error('Error en POST /productos:', err);
    res.status(500).json({ error: 'Error al crear producto' });
  }
});

// PUT /api/productos/:id (admin)
router.put('/:id', soloAdmin, async (req, res) => {
  const { id } = req.params;
  const { tipo, nombre, precio, descripcion, imagen, stock } = req.body;
  if (!nombre) {
    return res.status(400).json({ error: 'Nombre es obligatorio' });
  }
  try {
    const update = { tipo, nombre, precio, descripcion };
    if (imagen) update.imagen = imagen;
    if (stock !== undefined) update.stock = stock;
    const result = await req.app.locals.db
      .collection('productos')
      .updateOne({ _id: new ObjectId(id) }, { $set: update });
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json({ message: 'Producto actualizado' });
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
