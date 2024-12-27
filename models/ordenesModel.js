// models/ordenesModel.js
const pool = require('../config/database/db.js');

// Crear una nueva orden
const createOrden = async (usuario_id, total) => {
    const query = `
        INSERT INTO ordenes (usuario_id, total, creado_en)
        VALUES ($1, $2, NOW())
        RETURNING *;
    `;
    const result = await pool.query(query, [usuario_id, total]);
    return result.rows[0];
};

// Obtener las órdenes de un usuario
const getOrdenesByUsuarioId = async (usuario_id) => {
    const query = `
        SELECT * FROM ordenes
        WHERE usuario_id = $1;
    `;
    const result = await pool.query(query, [usuario_id]);
    return result.rows;
};

module.exports = { createOrden, getOrdenesByUsuarioId };
