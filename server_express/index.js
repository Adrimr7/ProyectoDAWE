import express, { json, urlencoded } from 'express';
import cors from 'cors';
import { MongoClient } from 'mongodb';
import session from 'express-session';

import usuariosRuta from './rutas/usuarios';
import productosRuta from './rutas/productos';

var aplicacion = express();
var admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

var PUERTO = process.env.PORT || 5000;

// conexion a mongo???
var MONGO_URI = 'mongodb://admin:admin@db:27017/tienda?authSource=admin';

var mongojs = require('mongojs');
var bd = mongojs(MONGO_URI, ['tienda']);

aplicacion.set('view engine', 'ejs');
aplicacion.set('views', 'views');

// Middleware
aplicacion.use(express.static('public'));
aplicacion.use(express.json());
aplicacion.use(express.urlencoded({extended: false})); 

aplicacion.use(json({ limit: '40mb' }));
aplicacion.use(urlencoded({ extended: true, limit: '40mb' }));

// config de CORS
aplicacion.use(cors({
  // permitir los origenes
  origin: ['http://localhost:3000', 'http://localhost:5000', 'http://134.122.104.67:3000/', 'http://134.122.104.67:5000/'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// sesiones
aplicacion.use(session({
  // variable de entorno???
  secret: 'clave_secreta_para_firmar_session',
  resave: false,
  saveUninitialized: false,
  store: create({
    mongoUrl: MONGO_URI,
    // 24h de sesion
    ttl: 60 * 60 * 24,
    autoRemove: 'native'
  }),
  // cookie
  cookie: {
    secure: false,
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 24,
  }
}));

aplicacion.use('/api/usuarios', usuariosRuta);
aplicacion.use('/api/productos', productosRuta);

aplicacion.get('/', (req, res) => {
  res.json({ 
    mensaje: 'Servidor funciona!',

    session: req.session.email ? {
      email: req.session.email,

    } : 'No hay sesión activa'
  });
});

aplicacion.get('/api/comprobar-sesion', (req, res) => {
  if (req.session.email) {
    res.json({ 
      autenticado: true, 
      email: req.session.email,
    });
  } else {
    res.json({ autenticado: false });
  }
});

// config de iniciar servidor
async function iniciarServidor() {
  try {
    const client = new MongoClient(MONGO_URI);
        await client.connect();
    console.log('Conexion correcta exitosa con MongoDB');
        aplicacion.locals.db = client.db('tienda');
    
    aplicacion.listen(PUERTO, () => {
      console.log(`Servidor funcionando en el puerto ${PUERTO}`);
    });
  } catch (error) {
    console.error('Error al conectar con MongoDB:', error);
    process.exit(1);
  }
}

iniciarServidor();