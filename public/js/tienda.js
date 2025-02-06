import { guidGenerator, IMAGEN_POR_DEFECTO } from './utils.js';

//Superclase de la que hereda el resto.
class Producto {
    #id;
    #nombre;
    #precio;
    #descripcion;
    #imagen;

    constructor(nombre, precio, descripcion = "Sin descripción", imagen = null) {
        this.#id = guidGenerator();
        this.#nombre = nombre;
        this.#precio = precio;
        this.#descripcion = descripcion;
        this.#imagen = imagen || IMAGEN_POR_DEFECTO;
    }

    // Getters
    get id() {
        return this.#id;
    }

    get nombre() {
        return this.#nombre;
    }

    get precio() {
        return this.#precio;
    }

    get descripcion() {
        return this.#descripcion;
    }

    get imagen() {
        return this.#imagen;
    }

    // Setters
    set nombre(nombre) {
        this.#nombre = nombre;
    }

    set precio(precio) {
        this.#precio = precio;
    }

    set descripcion(descripcion) {
        this.#descripcion = descripcion;
    }

    set imagen(imagen) {
        this.#imagen = imagen || IMAGEN_POR_DEFECTO;
    }
}

//Subclases

class JetGrande extends Producto {
    #num_pasajeros;
    constructor(nombre, precio, descripcion, imagen, num_pasajeros) {
        super(nombre, precio, descripcion, imagen);
        this.#num_pasajeros = num_pasajeros;
    }
    get num_pasajeros() {
        return this.#num_pasajeros;
    }
    set num_pasajeros(num) {
        this.#num_pasajeros = num;
    }
}

class JetMediano extends Producto {
    #num_pasajeros;
    constructor(nombre, precio, descripcion, imagen, num_pasajeros) {
        super(nombre, precio, descripcion, imagen);
        this.#num_pasajeros = num_pasajeros;
    }
    get num_pasajeros() {
        return this.#num_pasajeros;
    }
    set num_pasajeros(num) {
        this.#num_pasajeros = num;
    }
}

class JetPequeno extends Producto {
    #num_pasajeros;
    constructor(nombre, precio, descripcion, imagen, num_pasajeros) {
        super(nombre, precio, descripcion, imagen);
        this.#num_pasajeros = num_pasajeros;
    }
    get num_pasajeros() {
        return this.#num_pasajeros;
    }
    set num_pasajeros(num) {
        this.#num_pasajeros = num;
    }
}

class Avioneta extends Producto {
    #alcance;
    constructor(nombre, precio, descripcion, imagen, alcance) {
        super(nombre, precio, descripcion, imagen);
        this.#alcance = alcance;
    }
    get alcance() {
        return this.#alcance;
    }
    set alcance(personal) {
        this.#alcance = personal;
    }
}

class Helicoptero extends Producto {
    #facilidades;
    constructor(nombre, precio, descripcion, imagen, facilidades = []) {
        super(nombre, precio, descripcion, imagen);
        this.#facilidades = facilidades;
    }
    get facilidades() {
        return this.#facilidades;
    }
    set facilidades(facilidades) {
        this.#facilidades = facilidades;
    }
}

const productos = [
    // todos los Jets tienen como parametro adicional el numero de pasajeros.
    // Jets Grandes. (constructora) +  Numero de pasajeros.
    new JetGrande("Gulfstream GIV-SP", 4199000, "Modelo clásico dentro del rango máximo. El Gulfstream GIV-SP, fabricado por Gulfstream Aerospace, es un jet ejecutivo de gran tamaño con capacidad para 14 pasajeros. Ofrece una autonomía de aproximadamente 7,800 km, lo que lo hace ideal para vuelos transcontinentales. Su cabina espaciosa y lujosa incluye opciones de asientos reclinables y avanzados sistemas de entretenimiento a bordo.", "imagenes/jets/Gulfstream GIV-SP.jpg", 14),
    new JetGrande("Gulfstream G600", 50500000, "Capacidad máxima y buena relacion calidad/precio. El Gulfstream G600 es un avión ejecutivo de última generación con capacidad para 18 pasajeros y un alcance de 12,000 km. Su diseño aerodinámico y motores eficientes le permiten un menor consumo de combustible, manteniendo un alto rendimiento. Incorpora un avanzado sistema de cabina con controles táctiles y una conectividad excepcional.", "imagenes/jets/Gulfstream G600.jpg", 18),
    new JetGrande("Gulfstream G650", 59800000, "Jet de largo alcance y lujo. Considerado un símbolo de estatus en la aviación privada, el Gulfstream G650 es un jet ultralujoso con espacio para 19 pasajeros. Puede volar hasta 13,000 km sin escalas, permitiendo vuelos intercontinentales sin interrupciones. Su cabina está presurizada a menor altitud para mayor comodidad y reduce el jet lag.", "imagenes/jets/Gulfstream G650.jpg", 19),
    new JetGrande("Gulfstream G700", 72000000, "Jet de última generación. El Gulfstream G700 es el buque insignia de Gulfstream, con 20 plazas y una de las cabinas más grandes del mercado. Tiene un alcance de 13,890 km, lo que le permite volar de Nueva York a Tokio sin escalas. Ofrece dormitorios privados y control de ambiente personalizable con iluminación circadiana.", "imagenes/jets/Gulfstream G700.jpg", 20),
    new JetGrande("Bombardier Global 7500", 81000000, "Jet intercontinental con máxima comodidad. El Bombardier Global 7500 es un jet de lujo fabricado por Bombardier Aerospace. Puede albergar 19 pasajeros y recorrer hasta 14,260 km sin escalas. Su diseño interior incluye cuatro zonas separadas, cocina completa y cama tamaño king, brindando una experiencia de vuelo inigualable.", "imagenes/jets/Bombardier Global 7500.jpg", 19),
    new JetGrande("Bombardier Global 8000", 92000000, "Gama premium, intercontinental, moderno y de extra lujo. El Global 8000 es la versión más avanzada de Bombardier, ofreciendo una autonomía sin precedentes de 14,800 km. Su cabina puede personalizarse con detalles de madera y piel de alta calidad, e incluye el sistema de purificación de aire 'Pur Air', que renueva el aire cada 90 segundos.", "imagenes/jets/Bombardier Global 8000.jpg", 22),

    // Jets Medianos. (constructora) +  Numero de pasajeros.
    new JetMediano("Gulfstream G500", 39000000, "Jet ejecutivo de rango medio. El Gulfstream G500 es un jet mediano de lujo con capacidad para 16 pasajeros y una autonomía de 9,800 km. Su avanzada tecnología 'fly-by-wire' garantiza un vuelo más suave y eficiente. Su cabina espaciosa y silenciosa ofrece asientos ergonómicos, conectividad de última generación y un sistema de presurización optimizado para mayor comodidad.", "imagenes/jets/Gulfstream G650.jpg", 16),
    new JetMediano("Cessna Citation X+", 35000000, "Jet mediano con gran velocidad. El Citation X+ de Cessna es el jet ejecutivo más rápido del mundo, alcanzando Mach 0.935 (1,155 km/h). Puede cruzar EE.UU. en menos de 4 horas y tiene capacidad para 12 pasajeros. Su cabina de lujo incluye materiales premium, asientos reclinables y tecnología avanzada de control de vuelo para un desplazamiento eficiente.", "imagenes/jets/Cessna Citation X+.jpg", 12),
    new JetMediano("Cessna Citation Longitude", 36000000, "Gran alcance para su precio. El Citation Longitude es un jet de negocios con capacidad para 12 pasajeros y una autonomía de 6,500 km, ideal para vuelos intercontinentales. Su cabina insonorizada ofrece Wi-Fi de alta velocidad, asientos reclinables y un moderno sistema de aterrizaje automático. Su eficiencia de combustible es un 15% superior a modelos similares.", "imagenes/jets/Cessna Citation Longitude.jpg", 12),
    new JetMediano("Embraer Legacy 500", 29900000, "Jet con avanzada tecnología de cabina. El Embraer Legacy 500 es un jet mediano de alto rendimiento con espacio para 12 pasajeros y un alcance de 5,800 km. Su cabina cuenta con suelo completamente plano, asientos reclinables y un avanzado sistema de presurización que reduce la fatiga en vuelos largos. Destaca por su cabina digital de última generación y operación eficiente.", "imagenes/jets/Embraer Legacy 500.jpg", 12),
    new JetMediano("Bombardier Challenger 350", 32000000, "Alcance medio, perfecto para viajes ejecutivos. El Challenger 350, fabricado por Bombardier, ofrece una combinación de lujo y rendimiento con capacidad para 10 pasajeros y un alcance de 5,900 km. Su cabina espaciosa incorpora ventanas panorámicas, conectividad satelital y un sistema de entretenimiento de alta calidad. Su eficiencia y comodidad lo convierten en uno de los jets ejecutivos más populares.", "imagenes/jets/Bombardier Challenger 350.jpg", 10),

    // Jets Pequeños. (constructora) +  Numero de pasajeros.
    new JetPequeno("Cessna Citation CJ4", 28000000, "Mucha cantidad de pasajeros. El Citation CJ4, de Cessna, es un jet ligero con capacidad para 10 pasajeros y una autonomía de 3,700 km. Su cabina optimizada ofrece asientos de cuero reclinables, ventanas panorámicas y un diseño aerodinámico que reduce el consumo de combustible. Es ideal para viajes rápidos y eficientes.", "imagenes/jets/Cessna Citation CJ4.jpg", 10),
    new JetPequeno("Cessna Citation CJ3+", 28000000, "Moderno y con muy buena eficiencia de combustible. El Citation CJ3+ es un jet ejecutivo compacto con espacio para 9 pasajeros y un alcance de 3,800 km. Su cabina silenciosa y tecnología de vuelo avanzada lo hacen una opción ideal para quienes buscan comodidad y eficiencia operativa. Su bajo costo de mantenimiento lo convierte en una alternativa económica dentro de su categoría.", "imagenes/jets/Cessna Citation CJ3+.jpg", 9),
    new JetPequeno("Cessna Citation M2", 18000000, "Jet compacto y económico en mantenimiento y uso. El Citation M2 es el modelo más accesible de la familia Citation, diseñado para 6 pasajeros con un alcance de 2,900 km. Su interior cuenta con acabados premium, iluminación LED y un sistema de control de vuelo intuitivo. Es una opción perfecta para vuelos cortos con costos operativos reducidos.", "imagenes/jets/Cessna Citation M2.jpg", 6),
    new JetPequeno("Honda HondaJet Elite", 25000000, "Jet pequeño con alta eficiencia. El HondaJet Elite, fabricado por Honda Aircraft Company, es un jet ligero con una innovadora configuración de motores sobre el ala, mejorando la aerodinámica y reduciendo el ruido. Puede transportar 6 pasajeros y alcanzar 2,600 km de autonomía. Su interior de lujo ofrece asientos ergonómicos, iluminación ambiental y una cabina silenciosa.", "imagenes/jets/Honda HondaJet Elite.jpg", 6),
    new JetPequeno("Bombardier Learjet 75 Liberty", 28000000, "Jet compacto y rápido. El Learjet 75 Liberty, de Bombardier, es un jet ligero con capacidad para 9 pasajeros y un alcance de 3,800 km. Su cabina incluye una distribución espaciosa con asientos ejecutivos reclinables, conectividad de alta velocidad y un avanzado sistema de vuelo digital. Es conocido por su velocidad y rendimiento en rutas cortas y medianas.", "imagenes/jets/Bombardier Learjet 75 Liberty.jpg", 9),

    // Avionetas. (constructora) +  Alcance en KMs.
    new Avioneta("Cessna 172 Skyhawk", 490000, "Avioneta de entrenamiento y turismo. La Cessna 172 Skyhawk es la avioneta más popular del mundo, utilizada tanto para entrenamiento de pilotos como para vuelos recreativos. Tiene capacidad para 4 personas y un alcance de 1,289 km. Su bajo consumo de combustible y facilidad de manejo la convierten en una opción ideal para pilotos principiantes.", "imagenes/avionetas/Cessna 172 Skyhawk.jpg", 1289),
    new Avioneta("Piper PA-28 Cherokee", 540000, "Avioneta versátil para viajes cortos. El Piper PA-28 Cherokee es una avioneta monomotor de alto rendimiento, ideal para vuelos privados y de instrucción. Puede transportar 4 pasajeros y recorrer hasta 1,389 km sin escalas. Su diseño aerodinámico y controles intuitivos hacen que sea una de las opciones más confiables en su categoría.", "imagenes/avionetas/Piper PA-28 Cherokee.jpg", 1389),
    new Avioneta("Diamond DA40", 345000, "Avioneta ligera y eficiente. El Diamond DA40 es una avioneta de última generación, reconocida por su bajo consumo de combustible y construcción en materiales compuestos. Tiene espacio para 4 pasajeros y un alcance de 1,350 km. Su avanzada aviónica y cabina panorámica ofrecen una experiencia de vuelo segura y cómoda.", "imagenes/avionetas/Diamond DA40.jpg", 1350),
    new Avioneta("Beechcraft Bonanza G36", 875000, "Avioneta premium, para los más exigentes. La Beechcraft Bonanza G36 es una avioneta de lujo con capacidad para 6 pasajeros y un alcance de 1,482 km. Su motor de alto rendimiento y diseño espacioso la convierten en una de las mejores opciones para vuelos ejecutivos o familiares. Es famosa por su estabilidad y confort en largas distancias.", "imagenes/avionetas/Beechcraft Bonanza G36jpg", 1482),
    new Avioneta("Mooney M20", 674000, "Avioneta con gran alcance para su precio. El Mooney M20 es una avioneta de alta velocidad con una aerodinámica optimizada que le permite alcanzar 1,600 km de autonomía. Su diseño compacto y eficiente la hace ideal para vuelos cortos. Su fuselaje en materiales ligeros reduce el consumo de combustible sin sacrificar rendimiento.", "imagenes/avionetas/Mooney M20.jpg", 1600),

    // Helicópteros. (constructora) +  Facilidades.
    new Helicoptero("Robinson R44", 240000, "Helicóptero ligero de entrenamiento. El Robinson R44 es uno de los helicópteros más populares para entrenamiento y transporte privado. Con capacidad para 4 personas y una autonomía de 650 km, es conocido por su bajo consumo de combustible y facilidad de mantenimiento. Su diseño ligero lo convierte en una opción ideal para vuelos recreativos y formación de pilotos.", "imagenes/helicopteros/Robinson R44.jpg", ["Wi-Fi"]),
    new Helicoptero("Bell 407", 1300000, "Helicóptero de lujo con gran capacidad. El Bell 407 es un helicóptero monomotor de alto rendimiento con capacidad para 7 pasajeros y una autonomía de 624 km. Su cabina espaciosa, insonorizada y con acabados de lujo lo convierten en una excelente opción para el transporte ejecutivo. Además, su versatilidad lo hace ideal para misiones de rescate y vigilancia.", "imagenes/helicopteros/Bell 407.jpg", ["Wi-Fi", "Cámara profesional"]),
    new Helicoptero("AgustaWestland AW109", 4190000, "Helicóptero de rescate y operaciones especiales. El AW109, fabricado por AgustaWestland, es un helicóptero bimotor de alta velocidad con capacidad para 6 pasajeros y un alcance de 932 km. Es ampliamente utilizado en misiones médicas, rescates y transporte VIP gracias a su avanzada aviónica y gran estabilidad en vuelo. Puede operar incluso en condiciones climáticas adversas.", "imagenes/helicopteros/AgustaWestland AW109.jpg", ["Wi-Fi"]),
    new Helicoptero("Sikorsky S-76", 2200000, "Helicóptero para transporte de material pesado. El Sikorsky S-76 es un helicóptero bimotor diseñado para transporte ejecutivo y misiones industriales. Puede llevar hasta 13 pasajeros y tiene un alcance de 832 km. Su potente motor y capacidad de carga lo hacen ideal para transporte de personal en plataformas petroleras y evacuaciones médicas.", "imagenes/helicopteros/Sikorsky S-76.jpg", ["Wi-Fi"]),
    new Helicoptero("Airbus H125", 3100000, "Helicóptero con alto rendimiento. El Airbus H125 es un helicóptero monomotor extremadamente versátil, con capacidad para 6 pasajeros y un alcance de 660 km. Su diseño ligero y potente motor le permiten operar en altitudes elevadas y temperaturas extremas, siendo utilizado en misiones de rescate en montaña, patrullaje y turismo.", "imagenes/helicopteros/Airbus H125.jpg", ["Wi-Fi"])
];

//Lista para el carrito
const carrito = [];

export { productos, carrito, Avioneta, JetGrande, JetMediano, JetPequeno, Helicoptero };
