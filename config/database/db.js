const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
        rejectUnauthorized: false // Habilita SSL sin requerir el archivo .pem
    }
});

pool.connect((err) => {
    if (err) {
        console.error('Error al conectar con la base de datos:', err);
    } else {
        console.log('Conexión exitosa con PostgreSQL');
    }
});

module.exports = pool;
