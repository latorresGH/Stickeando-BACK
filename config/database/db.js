const { Pool } = require ('pg'); // Hacemos un pool (conexión a la base de datos) con el paquete pg 'PostgreSQL'
const dotenv = require ('dotenv'); // Importamos dotenv de nuevo para utilizar las variables del .env
const { ssl } = require('pg/lib/defaults');
const fs = require('fs'); // Para poder usar el módulo fs y leer archivos del sistema de archivos

dotenv.config(); // <- cargamos los datos .env

const pool = new Pool({ // <- creamos el pool con los datos del dotenv.
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
        rejectUnauthorized: false, // Para evitar rechazar conexiones no autorizadas
        ca: fs.readFileSync(__dirname + '/../../certificados/us-east-2-bundle.pem').toString() // Ruta al archivo PEM que descargaste
    }
});

pool.connect((err) => { // <- intento de conexión para confirmar que se haga la conexión correctamente.
    if (err) {
        console.error('Error al conectar con la base de datos:', err);
    } else {
        console.log('Conexión exitosa con PostgreSQL');
    }
});

module.exports = pool;
