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
app.get("/productos", async (req, res) => {
  const products = await Producto.find();
  res.json(products);
});

// POST /productos
app.post("/productos", async (req, res) => {
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



// DELETE /productos/:id
app.delete("/productos/:id", async (req, res) => {
  const { id } = req.params;
  await Producto.findByIdAndDelete(id);
  res.json({ message: "Producto deleted" });
});

// PUT /productos/:id
app.put("/productos/:id", async (req, res) => {
  const { id } = req.params;
  const updatedProduct = await Producto.findByIdAndUpdate(id, req.body, { new: true });
  res.json(updatedProduct);
});

// Start Server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
*/
// GET /productos
router.get('/productos', async (req, res) => {
    try {
      const db = req.app.locals.db;
      const productos = await db.collection('Productos').find({}).toArray();
      
      const productosMapeados = productos.map(producto => {
        
        const productoMapeado = {
          id: producto._id,
          tipo: producto.Tipo,
          nombre: producto.Nombre,
          precio: producto.Precio,
          descripcion: producto.Descripcion,
          imagen: producto.RutaImagen || '/imagenes/default.png'
        };
        
        if (producto.Tipo == 'JetGrande' || producto.Tipo == 'JetMediano' || producto.Tipo == 'JetPequeno') {
            productoMapeado.numPasajeros = producto.NumPasajeros;
          }
          else if (producto.Tipo == 'Avioneta') {
            productoMapeado.alcance = producto.Alcance;
          }
          else if (producto.Tipo == 'Helicoptero') {
            productoMapeado.facilidades = producto.Facilidades;
          }
          else {
            return res.status(400).json({ error: 'Tipo de producto no válido' });
          }
        
        return productoMapeado;
      });
      
      res.json(productosMapeados);
    } 
    catch (error) {
      console.error('Error al obtener productos:', error);
      res.status(500).json({ error: 'Error al obtener lista de productos' });
    }
  });
  
  // GET /productos/:id
  router.get('/productos:id', async (req, res) => {
    try {
      const db = req.app.locals.db;
      const producto = await db.collection('Productos').findOne({ _id: new ObjectId(req.params.id) });
      
      if (!producto) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }
      
      const productoMapeado = {
        id: producto._id,
        tipo: producto.Tipo,
        nombre: producto.Nombre,
        precio: producto.Precio,
        descripcion: producto.Descripcion,
        imagen: producto.RutaImagen || '/imagenes/default.png'
      };
      
      if (producto.Tipo == 'JetGrande' || producto.Tipo == 'JetMediano' || producto.Tipo == 'JetPequeno') {
        productoMapeado.numPasajeros = producto.NumPasajeros;
      }
      else if (producto.Tipo == 'Avioneta') {
        productoMapeado.alcance = producto.Alcance;
      }
      else if (producto.Tipo == 'Helicoptero') {
        productoMapeado.facilidades = producto.Facilidades;
      }
      else {
        return res.status(400).json({ error: 'Tipo de producto no válido' });
      }
      
      res.json(productoMapeado);
    } 
    catch (error) {
      console.error('Error al obtener producto:', error);
      res.status(500).json({ error: 'Error al obtener información del producto' });
    }
  });
  
  // POST /productos (admin)
  router.post('/productos', comprobarAdmin, async (req, res) => {
    const { tipo, nombre, precio, descripcion, imagen, numPasajeros, alcance, facilidades } = req.body;
    
    if (!tipo || !nombre || !precio) {
      return res.status(400).json({ error: 'Tipo, nombre y precio son campos obligatorios' });
    }
    
    try {
      const db = req.app.locals.db;
      const precioDouble = parseFloat(precio);
      if (isNaN(precioDouble)) {
        return res.status(400).json({ error: 'El precio debe ser un valor numérico válido' });
      }
      
      const nuevoProducto = {
        Tipo: String(tipo),
        Nombre: String(nombre),
        Precio: precioDouble + 0.0,
        Descripcion: descripcion ? String(descripcion) : '',
        RutaImagen: imagen ? String(imagen) : '/imagenes/default.png'
      };
      
      if (producto.Tipo == 'JetGrande' || producto.Tipo == 'JetMediano' || producto.Tipo == 'JetPequeno') {
        productoMapeado.NumPasajeros = String(numPasajeros);
      }
      else if (producto.Tipo == 'Avioneta') {
        productoMapeado.Alcance = String(alcance);
      }
      else if (producto.Tipo == 'Helicoptero') {
        productoMapeado.Facilidades = String(facilidades);
      }
      else {
        return res.status(400).json({ error: 'Tipo de producto no válido' });
      }
      
      console.log('Intentando insertar producto:', nuevoProducto);
      
      const resultado = await db.collection('Productos').insertOne(nuevoProducto);
      
      res.status(201).json({ 
        mensaje: 'Producto creado correctamente',
        id: resultado.insertedId
      });
    } 
    catch (error) {
      console.error('Error al crear producto:', error);
            let mensajeError = 'Error al crear producto';
      if (error.errInfo && error.errInfo.details) {
        mensajeError += ': ' + JSON.stringify(error.errInfo.details);
      }
      
      res.status(500).json({ error: mensajeError });
    }
  });
  
  // PUT /productos/:id (admin)
  router.put('/productos:id', comprobarAdmin, async (req, res) => {
    const { tipo, nombre, precio, descripcion, imagen, numPasajeros, alcance, facilidades } = req.body;
    
    if (!tipo || !nombre || !precio) {
      return res.status(400).json({ error: 'Tipo, nombre y precio son campos obligatorios' });
    }
    
    try {
      const db = req.app.locals.db;
      
      const productoExistente = await db.collection('Productos').findOne({ _id: new ObjectId(req.params.id) });
      if (!productoExistente) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }
      
      const productoActualizado = {
        Nombre: nombre,
        Precio: parseFloat(precio),
        Descripcion: descripcion || '',
      };
      
      if (imagen) {
        productoActualizado.RutaImagen = imagen;
      }
      
      if (producto.Tipo == 'JetGrande' || producto.Tipo == 'JetMediano' || producto.Tipo == 'JetPequeno') {
        if (numPasajeros) productoMapeado.NumPasajeros = numPasajeros;
      }
      else if (producto.Tipo == 'Avioneta') {
        if (alcance) productoMapeado.Alcance = alcance;
      }
      else if (producto.Tipo == 'Helicoptero') {
        if (facilidades) productoMapeado.Facilidades = String(facilidades);
      }
      else {
        return res.status(400).json({ error: 'Tipo de producto no válido' });
      }
      
      const resultado = await db.collection('Productos').updateOne(
        { _id: new ObjectId(req.params.id) },
        { $set: productoActualizado }
      );
      
      if (resultado.matchedCount === 0) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }
      
      res.json({ 
        mensaje: 'Producto actualizado correctamente' 
      });
    } 
    catch (error) {
      console.error('Error al actualizar producto:', error);
      res.status(500).json({ error: 'Error al actualizar producto' });
    }
  });
  
  // DELETE /productos/:id (admin)
  router.delete('/productos:id', comprobarAdmin, async (req, res) => {
    try {
      const db = req.app.locals.db;
      
      const resultado = await db.collection('Productos').deleteOne({ _id: new ObjectId(req.params.id) });
      
      if (resultado.deletedCount === 0) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }
      res.json({ mensaje: 'Producto eliminado correctamente' });
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      res.status(500).json({ error: 'Error al eliminar producto' });
    }
  });
  
  // DELETE /productos (admin)
  router.delete('/productos', comprobarAdmin, async (req, res) => {
    const { ids } = req.body;
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'Array de IDs' });
    }
    
    try {
      const db = req.app.locals.db;
      const objectIds = ids.map(id => new ObjectId(id));
      const resultado = await db.collection('Productos').deleteMany({ _id: { $in: objectIds } });
      
      if (resultado.deletedCount === 0) {
        return res.status(404).json({ error: 'No se han encontrado productos para eliminar' });
      }
      
      res.json({ 
        mensaje: 'Productos eliminados satisfactoriamente',
        eliminados: resultado.deletedCount
      });
    } 
    catch (error) {
      console.error('Error al eliminar productos:', error);
      res.status(500).json({ error: 'Error al eliminar productos' });
    }
  });
  