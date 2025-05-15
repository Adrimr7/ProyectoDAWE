import { MongoClient } from 'mongodb';
import session from 'express-session';
import express, { json, urlencoded } from 'express';
import cors from 'cors';
import multer from "multer";
import path from "path";


import usuariosRuta from './rutas/usuarios.js';
import productosRuta from './rutas/productos.js';
import  MongoStore  from 'connect-mongo';
import admin from 'firebase-admin';
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);

const serviceAccount = require("./firebase-adminsdk.json");

var aplicacion = express();




const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads");
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });



admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

var PUERTO = process.env.PORT || 5000;

// conexion a mongo???
var LINK_DB = process.env.MONGO_URI || 'mongodb://admin:admin@mongo:27017/tienda?authSource=admin';



// Middleware
aplicacion.use(express.static("public"));
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
  store: MongoStore.create({
    mongoUrl: LINK_DB,
    ttl: 60 * 60 * 24,
    autoRemove: 'native' // guardar la sesion
  }),
  // cookies
  cookie: {
    secure: false, 
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 24,
}
}));

aplicacion.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});


aplicacion.use('/usuarios', usuariosRuta);
aplicacion.use('/productos', productosRuta);

// GET / (comprobar app)
aplicacion.get('/', (solicitud, respuesta) => {
  respuesta.json({ 
    mensaje: 'Servidor funciona!',

    session: solicitud.session.email ? {
      email: solicitud.session.email,
      visitas: solicitud.session.visitas || 0,
    } : 'No hay sesion activa'
  });
});

// GET /comprobar-sesion 
aplicacion.get('/comprobar-sesion', (solicitud, respuesta) => {
  if (solicitud.session.email) {
    respuesta.json({ 
      autenticado: true, 
      email: solicitud.session.email,
    });
  } else {
    respuesta.json({ autenticado: false });
  }
});

// config de iniciar servidor
async function iniciarServidor() {
  try {
    const client = new MongoClient(LINK_DB);
        await client.connect();
    console.log('Conexion exitosa con MongoDB');
        aplicacion.locals.db = client.db('tienda');
    
    aplicacion.listen(PUERTO, () => {
      console.log(`Servidor funcionando, puerto ${PUERTO}`);
    });
  } catch (error) {
    console.error('Error al conectar con MongoDB:', error);
    process.exit(1);
  }
}

iniciarServidor();