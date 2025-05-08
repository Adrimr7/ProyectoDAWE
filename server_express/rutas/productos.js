import express, { Router } from 'express';
import { ObjectId } from 'mongodb';

const router = Router();

const comprobarLogeo = (solicitud, respuesta, next) => {
  if (!solicitud.session.email) {
    return respuesta.status(401).json({ error: 'Debes estar logeado para acceder' });
  }
  next();
};

const comprobarAdmin = async (solicitud, respuesta, next) => {
  if (!solicitud.session.email) {
    return respuesta.status(401).json({ error: 'Debes estar logeado para acceder' });
  }
  
  const db = solicitud.app.locals.db;
  const usuario = await db.collection('Usuarios').findOne({ Email: solicitud.session.email });
  
  if (!usuario || usuario.Rol !== 'administrador') {
    return respuesta.status(403).json({ error: 'No tienes permisos para acceder a este recurso' });
  }
  
  next();
};

/*
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

// GET /productos
app.get("/productos", async (solicitud, respuesta) => {
  const products = await Producto.find();
  respuesta.json(products);
});

// POST /productos
app.post("/productos", async (solicitud, respuesta) => {
  const camposPermitidos = {
      JetGrande: "num_pasajeros",
      JetMediano: "num_pasajeros",
      JetPequeno: "num_pasajeros",
      Avioneta: "alcance",
      Helicoptero: "facilidades",
    };
  const claveExtra = Object.keys(extra || {});
  if (claveExtra.length !== 1 || claveExtra[0] !== camposPermitidos[tipo]) {
    return respuesta.status(400).json({
      error: `El campo extra para el tipo "${tipo}" debe ser "${camposPermitidos[tipo]}"`,
    });
  }

  const productoNuevo = new Producto(solicitud.body);
  await productoNuevo.save();
  respuesta.json(productoNuevo);
});

// DELETE /productos/:id
app.delete("/productos/:id", async (solicitud, respuesta) => {
  const { id } = solicitud.params;
  await Producto.findByIdAndDelete(id);
  respuesta.json({ message: "Producto deleted" });
});

// PUT /productos/:id
app.put("/productos/:id", async (solicitud, respuesta) => {
  const { id } = solicitud.params;
  const updatedProduct = await Producto.findByIdAndUpdate(id, solicitud.body, { new: true });
  respuesta.json(updatedProduct);
});

// Start Server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
*/
// GET /productos
router.get('/productos', async (solicitud, respuesta) => {
    try {
      const db = solicitud.app.locals.db;
      const productos = await db.collection('Productos').find({}).toArray();
      
      const mapaProductos = productos.map(producto => {
        
        const avionMapeado = {
          id: producto._id,
          tipo: producto.Tipo,
          nombre: producto.Nombre,
          precio: producto.Precio,
          descripcion: producto.Descripcion,
          imagen: producto.RutaImagen || '/imagenes/default.png'
        };
        
        if (producto.Tipo == 'JetGrande' || producto.Tipo == 'JetMediano' || producto.Tipo == 'JetPequeno') {
          avionMapeado.numPasajeros = producto.NumPasajeros;
          }
          else if (producto.Tipo == 'Avioneta') {
            avionMapeado.alcance = producto.Alcance;
          }
          else if (producto.Tipo == 'Helicoptero') {
            avionMapeado.facilidades = producto.Facilidades;
          }
          else {
            return respuesta.status(400).json({ error: 'Tipo de producto no válido' });
          }
        
        return avionMapeado;
      });
      
      respuesta.json(mapaProductos);
    } 
    catch (error) {
      console.error('Error al obtener productos:', error);
      respuesta.status(500).json({ error: 'Error al obtener lista de productos' });
    }
  });
  
  // GET /productos/:id
  router.get('/productos:id', async (solicitud, respuesta) => {
    try {
      const db = solicitud.app.locals.db;
      const producto = await db.collection('Productos').findOne({ _id: new ObjectId(solicitud.params.id) });
      
      if (!producto) {
        return respuesta.status(404).json({ error: 'Producto no encontrado' });
      }
      
      const avionMapeado = {
        id: producto._id,
        tipo: producto.Tipo,
        nombre: producto.Nombre,
        precio: producto.Precio,
        descripcion: producto.Descripcion,
        imagen: producto.RutaImagen || '/imagenes/default.png'
      };
      
      if (producto.Tipo == 'JetGrande' || producto.Tipo == 'JetMediano' || producto.Tipo == 'JetPequeno') {
        avionMapeado.numPasajeros = producto.NumPasajeros;
      }
      else if (producto.Tipo == 'Avioneta') {
        avionMapeado.alcance = producto.Alcance;
      }
      else if (producto.Tipo == 'Helicoptero') {
        avionMapeado.facilidades = producto.Facilidades;
      }
      else {
        return respuesta.status(400).json({ error: 'Tipo de producto no válido' });
      }
      
      respuesta.json(avionMapeado);
    } 
    catch (error) {
      console.error('Error al obtener producto:', error);
      respuesta.status(500).json({ error: 'Error al obtener información del producto' });
    }
  });
  
  // POST /productos (admin)
  router.post('/productos', comprobarAdmin, async (solicitud, respuesta) => {
    const { tipo, nombre, precio, descripcion, imagen, numPasajeros, alcance, facilidades } = solicitud.body;
    
    if (!tipo || !nombre || !precio) {
      return respuesta.status(400).json({ error: 'Tipo, nombre y precio son campos obligatorios' });
    }
    
    try {
      const db = solicitud.app.locals.db;
      const precioDouble = parseFloat(precio);
      if (isNaN(precioDouble)) {
        return respuesta.status(400).json({ error: 'El precio debe ser un valor numérico válido' });
      }
      
      const nuevoAvion = {
        Tipo: String(tipo),
        Nombre: String(nombre),
        Precio: precioDouble + 0.0,
        Descripcion: descripcion ? String(descripcion) : '',
        RutaImagen: imagen ? String(imagen) : '/imagenes/default.png'
      };
      
      if (producto.Tipo == 'JetGrande' || producto.Tipo == 'JetMediano' || producto.Tipo == 'JetPequeno') {
        avionMapeado.NumPasajeros = String(numPasajeros);
      }
      else if (producto.Tipo == 'Avioneta') {
        avionMapeado.Alcance = String(alcance);
      }
      else if (producto.Tipo == 'Helicoptero') {
        avionMapeado.Facilidades = String(facilidades);
      }
      else {
        return respuesta.status(400).json({ error: 'Tipo de producto no válido' });
      }
      
      console.log('Intentando insertar producto:', nuevoAvion);
      
      const res = await db.collection('Productos').insertOne(nuevoAvion);
      
      respuesta.status(201).json({ 
        mensaje: 'Producto creado correctamente',
        id: res.insertedId
      });
    } 
    catch (error) {
      console.error('Error al crear producto:', error);
            let mensajeError = 'Error al crear producto';
      if (error.errInfo && error.errInfo.details) {
        mensajeError += ': ' + JSON.stringify(error.errInfo.details);
      }
      
      respuesta.status(500).json({ error: mensajeError });
    }
  });
  
  // PUT /productos/:id (admin)
  router.put('/productos:id', comprobarAdmin, async (solicitud, respuesta) => {
    const { tipo, nombre, precio, descripcion, imagen, numPasajeros, alcance, facilidades } = solicitud.body;
    
    if (!tipo || !nombre || !precio) {
      return respuesta.status(400).json({ error: 'Tipo, nombre y precio son campos obligatorios' });
    }
    
    try {
      const db = solicitud.app.locals.db;
      
      const avionActual = await db.collection('Productos').findOne({ _id: new ObjectId(solicitud.params.id) });
      if (!avionActual) {
        return respuesta.status(404).json({ error: 'Producto no encontrado' });
      }
      
      const avionActualizado = {
        Nombre: nombre,
        Precio: parseFloat(precio),
        Descripcion: descripcion || '',
      };
      
      if (imagen) {
        avionActualizado.RutaImagen = imagen;
      }
      
      if (producto.Tipo == 'JetGrande' || producto.Tipo == 'JetMediano' || producto.Tipo == 'JetPequeno') {
        if (numPasajeros) avionMapeado.NumPasajeros = numPasajeros;
      }
      else if (producto.Tipo == 'Avioneta') {
        if (alcance) avionMapeado.Alcance = alcance;
      }
      else if (producto.Tipo == 'Helicoptero') {
        if (facilidades) avionMapeado.Facilidades = String(facilidades);
      }
      else {
        return respuesta.status(400).json({ error: 'Tipo de producto no válido' });
      }
      
      const res = await db.collection('Productos').updateOne(
        { _id: new ObjectId(solicitud.params.id) },
        { $set: avionActualizado }
      );
      
      if (res.matchedCount === 0) {
        return respuesta.status(404).json({ error: 'Producto no encontrado' });
      }
      
      respuesta.json({ 
        mensaje: 'Producto actualizado correctamente' 
      });
    } 
    catch (error) {
      console.error('Error al actualizar producto:', error);
      respuesta.status(500).json({ error: 'Error al actualizar producto' });
    }
  });
  
  // DELETE /productos/:id (admin)
  router.delete('/productos:id', comprobarAdmin, async (solicitud, respuesta) => {
    try {
      const db = solicitud.app.locals.db;
      
      const res = await db.collection('Productos').deleteOne({ _id: new ObjectId(solicitud.params.id) });
      
      if (res.deletedCount === 0) {
        return respuesta.status(404).json({ error: 'Producto no encontrado' });
      }
      respuesta.json({ mensaje: 'Producto eliminado correctamente' });
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      respuesta.status(500).json({ error: 'Error al eliminar producto' });
    }
  });
  
  // DELETE /productos (admin)
  router.delete('/productos', comprobarAdmin, async (solicitud, respuesta) => {
    const { ids } = solicitud.body;
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return respuesta.status(400).json({ error: 'Array de IDs' });
    }
    
    try {
      const db = solicitud.app.locals.db;
      const objectIds = ids.map(id => new ObjectId(id));
      const res = await db.collection('Productos').deleteMany({ _id: { $in: objectIds } });
      
      if (res.deletedCount === 0) {
        return respuesta.status(404).json({ error: 'No se han encontrado productos para eliminar' });
      }
      
      respuesta.json({ 
        mensaje: 'Productos eliminados satisfactoriamente',
        eliminados: res.deletedCount
      });
    } 
    catch (error) {
      console.error('Error al eliminar productos:', error);
      respuesta.status(500).json({ error: 'Error al eliminar productos' });
    }
  });
  
export default router;