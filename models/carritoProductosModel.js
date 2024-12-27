const pool = require('../config/database/db.js');

const addProductoToCarrito = async (carrito_id, producto_id, cantidad) => {
    const query = `
        INSERT INTO carrito_productos (carrito_id, producto_id, cantidad)
        VALUES ($1, $2, $3)
        RETURNING *;
    `;
    const result = await pool.query(query, [carrito_id, producto_id, cantidad]);
    return result.rows[0];
};

const removeProductoFromCarrito = async (id) => {
    const query = `
        DELETE FROM carrito_productos
        WHERE id = $1;
    `;
    const result = await pool.query(query, [id]);
    return result.rowCount > 0;
};

const getProductosByCarritoId = async (carrito_id) => {
    const query = `
        SELECT cp.id, cp.cantidad, p.titulo, p.precio, p.imagen_url
        FROM carrito_productos cp
        INNER JOIN productos p ON cp.producto_id = p.id
        WHERE cp.carrito_id = $1;
    `;
    const result = await pool.query(query, [carrito_id]);
    return result.rows;
};

module.exports = { addProductoToCarrito, removeProductoFromCarrito, getProductosByCarritoId };
