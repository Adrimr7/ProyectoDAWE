import express from "express";
import { ObjectId } from "mongodb";
const router = express.Router();

// Ruta para comprobar sesión
router.get("/comprobar-sesion", (req, res) => {
  res.json({ autenticado: !!req.session.userId });
});

// Ruta para login con Firebase
router.post("/login", async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) return res.status(400).json({ error: "Token no proporcionado" });

    const { getAuth } = await import("firebase-admin/auth");
    const auth = getAuth();
    const decodedToken = await auth.verifyIdToken(idToken);

    const email = decodedToken.email;
    const db = req.app.locals.db;

    let usuario = await db.collection("usuarios").findOne({ email });

    if (!usuario) {
      const nuevoUsuario = {
        email,
        nombre: email.split("@")[0],
        rol: "",
        visitas: 1,
        telefono: "",
        direccion: "",
        fechaNacimiento: null
      };
      const resultado = await db.collection("usuarios").insertOne(nuevoUsuario);
      usuario = { _id: resultado.insertedId, ...nuevoUsuario };
    } else {
      await db.collection("usuarios").updateOne(
        { _id: usuario._id },
        { $set: { visitas: 1 } }
      );
    }

    req.session.userId = usuario._id.toString();
    req.session.email = usuario.email;
    req.session.nombre = usuario.nombre;
    req.session.rol = usuario.rol;

    await req.session.save();

    res.json({
      userId: usuario._id.toString(),
      email: usuario.email,
      nombre: usuario.nombre,
      rol: usuario.rol,
      visitas: req.session.visitas
    });
  } catch (err) {
    console.error("Error en POST /login:", err);
    res.status(500).json({ error: "Error en login" });
  }
});

// Ruta para obtener datos del usuario autenticado
router.get("/me", async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: "No autenticado" });
  }

  const db = req.app.locals.db;
  const usuario = await db.collection("usuarios").findOne({ _id: new ObjectId(req.session.userId) });

  if (!usuario) {
    return res.status(404).json({ error: "Usuario no encontrado" });
  }

  if (typeof req.session.visitas === "undefined") {
    req.session.visitas = 1;
  } else {
    req.session.visitas++;
  }
  await req.session.save();

  res.json({
    userId: req.session.userId,
    email: usuario.email,
    nombre: usuario.nombre,
    rol: usuario.rol,
    visitas: req.session.visitas,
    direccion: usuario.direccion,
    telefono: usuario.telefono,
    fechaNacimiento: usuario.fechaNacimiento
  });
});

// Ruta para actualizar datos del usuario
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  if (!req.session.userId || req.session.userId !== id) {
    return res.status(403).json({ error: "No autorizado" });
  }

  const { nombre, direccion, telefono, fechaNacimiento } = req.body;
  if (!nombre || !nombre.trim()) {
    return res.status(400).json({ error: "Nombre requerido" });
  }

  const db = req.app.locals.db;
  await db.collection("usuarios").updateOne(
    { _id: new ObjectId(id) },
    { $set: { nombre, direccion, telefono, fechaNacimiento } }
  );

  req.session.nombre = nombre;
  req.session.direccion = direccion;
  req.session.telefono = telefono;
  req.session.fechaNacimiento = fechaNacimiento;

  await req.session.save();

  res.json({
    email: req.session.email,
    nombre,
    direccion,
    telefono,
    fechaNacimiento
  });
});

// Ruta para logout
router.post("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error("Error al cerrar sesión:", err);
      return res.status(500).json({ error: "Error al cerrar sesión" });
    }
    res.clearCookie("connect.sid");
    res.json({ mensaje: "Sesión cerrada" });
  });
});

export default router;
