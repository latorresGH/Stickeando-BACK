const pool = require('../config/database/db.js');
const { v4: uuidv4 } = require('uuid');

const createCarrito = async (usuario_id) => {
    const uuid = usuario_id ? null : uuidv4();
    const result = await pool.query(
        `INSERT INTO carritos (usuario_id, uuid, creado_en)
         VALUES ($1, $2, NOW())
         RETURNING *`,
        [usuario_id || null, uuid]
    );
    return result.rows[0];
};


const getCarritoById = async (id) => {
    const query = `
        SELECT * FROM carritos
        WHERE id = $1;
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
};

const deleteCarrito = async (id) => {
    const query = `
        DELETE FROM carritos
        WHERE id = $1;
    `;
    const result = await pool.query(query, [id]);
    return result.rowCount > 0;
};

module.exports = { createCarrito, getCarritoById, deleteCarrito };
