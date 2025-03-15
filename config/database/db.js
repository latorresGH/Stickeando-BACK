const { Pool } = require ('pg'); // Hacemos un pool (conexión a la base de datos) con el paquete pg 'PostgreSQL'
const dotenv = require ('dotenv'); // Importamos dotenv de nuevo para utilizar las variables del .env
const { ssl } = require('pg/lib/defaults');

dotenv.config(); // <- cargamos los datos .env

const pool = new Pool({ // <- creamos el pool con los datos del dotenv.
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
        rejectUnauthorized: false
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
