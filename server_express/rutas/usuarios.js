import express, { Router } from 'express';
import { ObjectId } from 'mongodb';

const router = Router();

const comprobarLogeo = (req, res, next) => {
  if (!req.session.email) {
    return res.status(401).json({ error: 'Debes estar logeado para acceder' });
  }
  next();
};
  
const comprobarAdmin = async (req, res, next) => {
  if (!req.session.email) {
    return res.status(401).json({ error: 'Debes estar logeado para acceder' });
  }
  
  const db = req.app.locals.db;
  const usuario = await db.collection('Usuarios').findOne({ Email: req.session.email });
  
  if (!usuario || usuario.Rol !== 'administrador') {
    return res.status(403).json({ error: 'No tienes permisos para acceder a este recurso' });
  }
  
  next();
};

// POST /login 
router.post('/login', async (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ error: 'Email obligatorio' });
  }
  
  try {
    const db = req.app.locals.db;
    const usuario = await db.collection('Usuarios').findOne({ Email: email });
    
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    req.session.email = usuario.Email;
    req.session.nombre = usuario.Nombre;
    req.session.rol = usuario.Rol;
    // contador de visitas
    req.session.visitas = 0;
    req.session.ultimaVisitaRegistrada = Date.now();
    
    req.session.save((err) => {
      if (err) {
        console.error('Error al guardar la sesión:', err);
        return res.status(500).json({ error: 'Error al iniciar sesión' });
      }
            console.log('Sesión iniciada para:', usuario.Email);
      console.log('ID de sesión:', req.sessionID);
      
      res.json({
        mensaje: 'Inicio de sesión exitoso',
        usuario: {
          id: usuario._id,
          nombre: usuario.Nombre,
          email: usuario.Email,
          rol: usuario.Rol,
          // favoritos? 
        },
        visitas: req.session.visitas
      });
    });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});

// POST /logout
router.post('/logout', (req, res) => {
  const email = req.session.email;
  req.session.destroy((error) => {
    if (error) {
      console.error('Error al cerrar sesión:', error);
      return res.status(500).json({ error: 'Error al cerrar sesión' });
    }
    console.log('Sesión cerrada para:', email);
    res.clearCookie('connect.sid');
    res.json({ mensaje: 'Sesión cerrada correctamente' });
  });
});

// GET /perfil
router.get('/perfil', comprobarLogeo, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const usuario = await db.collection('Usuarios').findOne({ Email: req.session.email });
    
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    console.log(`Perfil solicitado para: ${usuario.Email} - Visitas: ${req.session.visitas || 1}`);
    
    res.json({
      usuario: {
        id: usuario._id,
        nombre: usuario.Nombre,
        email: usuario.Email,
        rol: usuario.Rol,
        // favoritos? 
      },
      visitas: req.session.visitas || 1
    });
  } 
  catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({ error: 'Error al obtener información del perfil' });
  }
});

// POST /incrementar-visitas
router.post('/incrementar-visitas', comprobarLogeo, (req, res) => {
  if (!req.session.visitas) {
    req.session.visitas = 1;
  } 
  else {
    req.session.visitas += 1;
  }
  
  req.session.ultimaVisitaRegistrada = Date.now();
  req.session.save((err) => {
    if (err) {
      console.error('Error al guardar sesión:', err);
      return res.status(500).json({ error: 'Error al incrementar visitas' });
    }
    
    console.log(`Visita incrementada para ${req.session.email} - Nuevo valor: ${req.session.visitas}`);
    res.json({ visitas: req.session.visitas });
  });
});

// PUT /actualizar
router.put('/actualizar', comprobarLogeo, async (req, res) => {
  // const { nombre, favoritos.... } = req.body;
  const { nombre } = req.body;
  
  if (!nombre || nombre.trim() === '') {
    return res.status(400).json({ error: 'El nombre no puede estar vacío' });
  }
  
  try {
    const db = req.app.locals.db;
    /*
        animalFavorito: animalFavorito || '',
        libroFavorito: libroFavorito || '',
        generoFavorito: generoFavorito || '',
    */
    const resultado = await db.collection('Usuarios').updateOne(
      { Email: req.session.email },
      { 
        $set: { 
          Nombre: nombre,
          // favoritos?
        } 
      }
    );
    if (resultado.matchedCount === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    req.session.nombre = nombre;
    req.session.save((err) => {
      if (err) {
        console.error('Error al guardar la sesión después de actualizar perfil:', err);
      }
      
      res.json({ 
        mensaje: 'Perfil actualizado correctamente',
        usuario: {
          nombre,
          email: req.session.email,
          rol: req.session.rol,
        } 
      });
    });
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    res.status(500).json({ error: 'Error al actualizar información del perfil' });
  }
});

// POST /crear (admin)
router.post('/crear', comprobarAdmin, async (req, res) => {

  const { nombre, email, rol} = req.body;
  
  if (!nombre || !email || !rol) {
    return res.status(400).json({ error: 'Nombre, email y rol son campos obligatorios' });
  }
  try {
    const db = req.app.locals.db;
    
    const usuarioExistente = await db.collection('Usuarios').findOne({ Email: email });
    if (usuarioExistente) {
      return res.status(400).json({ error: 'Ya existe un usuario con ese email' });
    }
    
    const nuevoUsuario = {
      Nombre: nombre,
      Email: email,
      Rol: rol,
      // favoritos?
    };
    
    const resultado = await db.collection('Usuarios').insertOne(nuevoUsuario);
    
    res.status(201).json({ 
      mensaje: 'Usuario creado correctamente',
      id: resultado.insertedId
    });
  } 
  catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({ error: 'Error al crear usuario' });
  }
});

// GET / (admin)
router.get('/', comprobarAdmin, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const usuarios = await db.collection('Usuarios').find({}).toArray();
    
    const usuariosMapeados = usuarios.map(usuario => ({
      id: usuario._id,
      nombre: usuario.Nombre,
      email: usuario.Email,
      rol: usuario.Rol,
      // favoritos?
    }));
    
    res.json(usuariosMapeados);
  } 
  catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error al obtener lista de usuarios' });
  }
});

module.exports = router;