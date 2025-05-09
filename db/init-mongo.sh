#!/bin/bash
set -e

mongosh <<EOF
use tienda

// -- Colección usuarios --
if (!db.getCollectionNames().includes('usuarios')) {
    db.createCollection('usuarios');
}
db.usuarios.insertMany([
    { email: "admin@ejemplo.com", nombre: "Administrador", rol: "admin", visitas: 0, telefono: "", direccion: "", fechaNacimiento: null, password: "123456" },
    { email: "usuario@ejemplo.com", nombre: "Usuario Normal", rol: "", visitas: 0, telefono: "", direccion: "", fechaNacimiento: null, password: "123456" },
    { email: "jon@gmail.com", nombre: "jon", rol: "", visitas: 0, telefono: "", direccion: "", fechaNacimiento: null, password: "123456" },
    { email: "adrian@gmail.com", nombre: "adrian", rol: "", visitas: 0, telefono: "", direccion: "", fechaNacimiento: null, password: "123456" },
    { email: "unax@gmail.com", nombre: "unax", rol: "", visitas: 0, telefono: "", direccion: "", fechaNacimiento: null, password: "123456" }
]);
db.usuarios.createIndex({ email: 1 }, { unique: true });

// -- Colección productos --
if (!db.getCollectionNames().includes('productos')) {
    db.createCollection('productos');
}
db.productos.insertMany([
    // Jets Grandes
    { tipo: "jetGrande", nombre: "Gulfstream GIV-SP", precio: 41990000, descripcion: "Modelo clásico dentro del rango máximo. El Gulfstream GIV-SP, fabricado por Gulfstream Aerospace, es un jet ejecutivo de gran tamaño con capacidad para 14 pasajeros. Ofrece una autonomía de aproximadamente 7,800 km, lo que lo hace ideal para vuelos transcontinentales. Su cabina espaciosa y lujosa incluye opciones de asientos reclinables y avanzados sistemas de entretenimiento a bordo.", imagen: "imagenes/jets/Gulfstream GIV-SP.jpg", num_pasajeros: 14 },
    { tipo: "jetGrande", nombre: "Gulfstream G600", precio: 50500000, descripcion: "Capacidad máxima y buena relación calidad/precio. El Gulfstream G600 es un avión ejecutivo de última generación con capacidad para 18 pasajeros y un alcance de 12,000 km. Su diseño aerodinámico y motores eficientes le permiten un menor consumo de combustible, manteniendo un alto rendimiento. Incorpora un avanzado sistema de cabina con controles táctiles y una conectividad excepcional.", imagen: "imagenes/jets/Gulfstream G600.jpg", num_pasajeros: 18 },
    { tipo: "jetGrande", nombre: "Gulfstream G650", precio: 59800000, descripcion: "Jet de largo alcance y lujo. Considerado un símbolo de estatus en la aviación privada, el Gulfstream G650 es un jet ultralujoso con espacio para 19 pasajeros. Puede volar hasta 13,000 km sin escalas, permitiendo vuelos intercontinentales sin interrupciones. Su cabina está presurizada a menor altitud para mayor comodidad y reduce el jet lag.", imagen: "imagenes/jets/Gulfstream G650.jpg", num_pasajeros: 19 },
    { tipo: "jetGrande", nombre: "Gulfstream G700", precio: 72000000, descripcion: "Jet de última generación. El Gulfstream G700 es el buque insignia de Gulfstream, con 20 plazas y una de las cabinas más grandes del mercado. Tiene un alcance de 13,890 km, lo que le permite volar de Nueva York a Tokio sin escalas. Ofrece dormitorios privados y control de ambiente personalizable con iluminación circadiana.", imagen: "imagenes/jets/Gulfstream G700.jpg", num_pasajeros: 20 },
    { tipo: "jetGrande", nombre: "Bombardier Global 7500", precio: 81000000, descripcion: "Jet intercontinental con máxima comodidad. El Bombardier Global 7500 es un jet de lujo fabricado por Bombardier Aerospace. Puede albergar 19 pasajeros y recorrer hasta 14,260 km sin escalas. Su diseño interior incluye cuatro zonas separadas, cocina completa y cama tamaño king, brindando una experiencia de vuelo inigualable.", imagen: "imagenes/jets/Bombardier Global 7500.jpg", num_pasajeros: 19 },
    { tipo: "jetGrande", nombre: "Bombardier Global 8000", precio: 92000000, descripcion: "Gama premium, intercontinental, moderno y de extra lujo. El Global 8000 es la versión más avanzada de Bombardier, ofreciendo una autonomía sin precedentes de 14,800 km. Su cabina puede personalizarse con detalles de madera y piel de alta calidad, e incluye el sistema de purificación de aire 'Pur Air', que renueva el aire cada 90 segundos.", imagen: "imagenes/jets/Bombardier Global 8000.jpg", num_pasajeros: 22 },
    { tipo: "jetGrande", nombre: "Boeing 737 Max", precio: 110000000, descripcion: "Para clientes que necesiten transportar a muchos pasajeros. La obra maestra de Boeing, un avión preparado para llegar a cualquier lugar del mundo, llevando a más pasajeros de los que probablemente se necesiten. Capacidad enorme y opción de adaptación para carga en vez de pasajeros (coste adicional a hablar con la empresa).", imagen: "imagenes/jets/Boeing 737 Max.jpg", num_pasajeros: 172 },

    // Jets Medianos
    { tipo: "jetMediano", nombre: "Gulfstream G500", precio: 39000000, descripcion: "Jet ejecutivo de rango medio. El Gulfstream G500 es un jet mediano de lujo con capacidad para 16 pasajeros y una autonomía de 9,800 km. Su avanzada tecnología 'fly-by-wire' garantiza un vuelo más suave y eficiente.", imagen: "imagenes/jets/Gulfstream G650.jpg", num_pasajeros: 16 },
    { tipo: "jetMediano", nombre: "Cessna Citation X+", precio: 35000000, descripcion: "Jet mediano con gran velocidad. El Citation X+ de Cessna es el jet ejecutivo más rápido del mundo, alcanzando Mach 0.935 (1,155 km/h).", imagen: "imagenes/jets/Cessna Citation X+.jpg", num_pasajeros: 12 },
    { tipo: "jetMediano", nombre: "Cessna Citation Longitude", precio: 36000000, descripcion: "Gran alcance para su precio. El Citation Longitude es un jet de negocios con capacidad para 12 pasajeros y una autonomía de 6,500 km.", imagen: "imagenes/jets/Cessna Citation Longitude.jpg", num_pasajeros: 12 },
    { tipo: "jetMediano", nombre: "Embraer Legacy 500", precio: 29900000, descripcion: "Jet con avanzada tecnología de cabina. El Embraer Legacy 500 es un jet mediano de alto rendimiento con espacio para 12 pasajeros.", imagen: "imagenes/jets/Embraer Legacy 500.jpg", num_pasajeros: 12 },
    { tipo: "jetMediano", nombre: "Bombardier Challenger 350", precio: 32000000, descripcion: "Alcance medio, perfecto para viajes ejecutivos. El Challenger 350, fabricado por Bombardier, ofrece una combinación de lujo y rendimiento.", imagen: "imagenes/jets/Bombardier Challenger 350.jpg", num_pasajeros: 10 },

    // Jets Pequeños
    { tipo: "jetPequeno", nombre: "Cessna Citation CJ4", precio: 28000000, descripcion: "Mucha cantidad de pasajeros. El Citation CJ4, de Cessna, es un jet ligero con capacidad para 10 pasajeros.", imagen: "imagenes/jets/Cessna Citation CJ4.jpg", num_pasajeros: 10 },
    { tipo: "jetPequeno", nombre: "Cessna Citation CJ3+", precio: 28000000, descripcion: "Moderno y con muy buena eficiencia de combustible. El Citation CJ3+ es un jet ejecutivo compacto con espacio para 9 pasajeros.", imagen: "imagenes/jets/Cessna Citation CJ3+.jpg", num_pasajeros: 9 },
    { tipo: "jetPequeno", nombre: "Cessna Citation M2", precio: 18000000, descripcion: "Jet compacto y económico en mantenimiento y uso. El Citation M2 es el modelo más accesible de la familia Citation.", imagen: "imagenes/jets/Cessna Citation M2.jpg", num_pasajeros: 6 },
    { tipo: "jetPequeno", nombre: "Honda HondaJet Elite", precio: 25000000, descripcion: "Jet pequeño con alta eficiencia. El HondaJet Elite, fabricado por Honda Aircraft Company, es un jet ligero.", imagen: "imagenes/jets/Honda HondaJet Elite.jpg", num_pasajeros: 6 },
    { tipo: "jetPequeno", nombre: "Bombardier Learjet 75 Liberty", precio: 28000000, descripcion: "Jet compacto y rápido. El Learjet 75 Liberty, de Bombardier, es un jet ligero con capacidad para 9 pasajeros.", imagen: "imagenes/jets/Bombardier Learjet 75 Liberty.jpg", num_pasajeros: 9 },

    // Avionetas
    { tipo: "avioneta", nombre: "Cessna 172 Skyhawk", precio: 490000, descripcion: "Avioneta de entrenamiento y turismo. La Cessna 172 Skyhawk es la avioneta más popular del mundo.", imagen: "imagenes/avionetas/Cessna 172 Skyhawk.jpg", alcance_km: 1289 },
    { tipo: "avioneta", nombre: "Piper PA-28 Cherokee", precio: 540000, descripcion: "Avioneta versátil para viajes cortos. El Piper PA-28 Cherokee es una avioneta monomotor de alto rendimiento.", imagen: "imagenes/avionetas/Piper PA-28 Cherokee.jpg", alcance_km: 1389 },
    { tipo: "avioneta", nombre: "Diamond DA40", precio: 345000, descripcion: "Avioneta ligera y eficiente. El Diamond DA40 es una avioneta de última generación.", imagen: "imagenes/avionetas/Diamond DA40.jpg", alcance_km: 1350 },
    { tipo: "avioneta", nombre: "Beechcraft Bonanza G36", precio: 875000, descripcion: "Avioneta premium, para los más exigentes. La Beechcraft Bonanza G36 es una avioneta de lujo.", imagen: "imagenes/avionetas/Beechcraft Bonanza G36.jpg", alcance_km: 1482 },
    { tipo: "avioneta", nombre: "Mooney M20", precio: 674000, descripcion: "Avioneta con gran alcance para su precio. El Mooney M20 es una avioneta de alta velocidad.", imagen: "imagenes/avionetas/Mooney M20.jpg", alcance_km: 1600 },

    // Helicópteros
    { tipo: "helicoptero", nombre: "Robinson R44", precio: 240000, descripcion: "Helicóptero ligero de entrenamiento. El Robinson R44 es uno de los helicópteros más populares.", imagen: "imagenes/helicopteros/Robinson R44.jpg", facilidades: ["Wi-Fi"] },
    { tipo: "helicoptero", nombre: "Bell 407", precio: 1300000, descripcion: "Helicóptero de lujo con gran capacidad. El Bell 407 es un helicóptero monomotor de alto rendimiento.", imagen: "imagenes/helicopteros/Bell 407.jpg", facilidades: ["Wi-Fi", "Cámara profesional"] },
    { tipo: "helicoptero", nombre: "AgustaWestland AW109", precio: 4190000, descripcion: "Helicóptero de rescate y operaciones especiales. El AW109, fabricado por AgustaWestland, es un helicóptero bimotor.", imagen: "imagenes/helicopteros/AgustaWestland AW109.jpg", facilidades: ["Wi-Fi"] },
    { tipo: "helicoptero", nombre: "Sikorsky S-76", precio: 2200000, descripcion: "Helicóptero para transporte de material pesado. El Sikorsky S-76 es un helicóptero bimotor diseñado para transporte ejecutivo.", imagen: "imagenes/helicopteros/Sikorsky S-76.jpg", facilidades: ["Wi-Fi"] },
    { tipo: "helicoptero", nombre: "Airbus H125", precio: 3100000, descripcion: "Helicóptero con alto rendimiento. El Airbus H125 es un helicóptero monomotor extremadamente versátil.", imagen: "imagenes/helicopteros/Airbus H125.jpg", facilidades: ["Wi-Fi"] }
]);

db.productos.createIndex({ nombre: 1 });
db.productos.createIndex({ tipo: 1 });

EOF

echo "== Datos de prueba insertados correctamente =="