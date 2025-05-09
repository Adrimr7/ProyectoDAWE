import { Router } from 'express';
import admin from 'firebase-admin';
import { ObjectId } from 'mongodb';

const router = Router();

// POST /usuarios/login
router.post('/login', async (req, res) => {
  const { idToken } = req.body;
  if (!idToken) {
    return res.status(400).json({ error: 'Falta idToken en la petición' });
  }

  try {
    // 1) Verificar token con Firebase Admin
    const decoded = await admin.auth().verifyIdToken(idToken);
    const email  = decoded.email;
    const nombre = decoded.name || email.split('@')[0];

    const db = req.app.locals.db;
    const usuariosCol = db.collection('usuarios');

    // 2) Buscar o crear usuario en MongoDB
    let usuario = await usuariosCol.findOne({ email });
    if (!usuario) {
      const nuevo = {
        email,
        nombre,
        rol: '',
        visitas: 1,
        telefono: '',
        direccion: '',
        fechaNacimiento: null
      };
      const result = await usuariosCol.insertOne(nuevo);
      usuario = { _id: result.insertedId, ...nuevo };
    } else {
      // Reiniciar contador de visitas a 1
      await usuariosCol.updateOne(
        { _id: usuario._id },
        { $set: { visitas: 1 } }
      );
      usuario.visitas = 1;
    }

    // 3) Configurar sesión
    req.session.userId  = usuario._id.toString();
    req.session.email   = usuario.email;
    req.session.nombre  = usuario.nombre;
    req.session.rol     = usuario.rol;
    req.session.visitas = usuario.visitas;
    await req.session.save();

    // 4) Responder con datos de usuario
    res.json({
      userId:  usuario._id,
      email:   usuario.email,
      nombre:  usuario.nombre,
      rol:     usuario.rol,
      visitas: usuario.visitas
    });
  } catch (error) {
    console.error('Error en POST /login:', error);
    res.status(401).json({ error: 'Token inválido o expirado' });
  }
});

// GET /usuarios/me
router.get('/me', async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'No autenticado' });
  }
  try {
    const db = req.app.locals.db;
    const userId = new ObjectId(req.session.userId);
    const usuario = await db.collection('usuarios').findOne({ _id: userId });
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({
      userId:        usuario._id,
      email:         usuario.email,
      nombre:        usuario.nombre,
      rol:           usuario.rol,
      visitas:       req.session.visitas,
      telefono:      usuario.telefono,
      direccion:     usuario.direccion,
      fechaNacimiento: usuario.fechaNacimiento
    });
  } catch (error) {
    console.error('Error en GET /me:', error);
    res.status(500).json({ error: 'Error al obtener datos del usuario' });
  }
});

// PUT /usuarios/:id
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, telefono, direccion, fechaNacimiento } = req.body;

  if (!req.session.userId || req.session.userId !== id) {
    return res.status(403).json({ error: 'No autorizado' });
  }
  if (!nombre || !nombre.trim()) {
    return res.status(400).json({ error: 'El nombre no puede estar vacío' });
  }

  try {
    const db = req.app.locals.db;
    const update = {
      nombre:        nombre.trim(),
      telefono:      telefono || '',
      direccion:     direccion || '',
      fechaNacimiento: fechaNacimiento || null
    };

    await db.collection('usuarios').updateOne(
      { _id: new ObjectId(id) },
      { $set: update }
    );

    // Actualizar sesión
    req.session.nombre        = update.nombre;
    req.session.telefono      = update.telefono;
    req.session.direccion     = update.direccion;
    req.session.fechaNacimiento = update.fechaNacimiento;
    await req.session.save();

    res.json({
      userId:          id,
      email:           req.session.email,
      nombre:          update.nombre,
      rol:             req.session.rol,
      visitas:         req.session.visitas,
      telefono:        update.telefono,
      direccion:       update.direccion,
      fechaNacimiento: update.fechaNacimiento
    });
  } catch (error) {
    console.error('Error en PUT /:id:', error);
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
});

export default router;
