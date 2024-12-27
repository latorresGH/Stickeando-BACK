// models/ordenesProductosModel.js
const pool = require('../config/database/db.js');

// Agregar productos a una orden
const addProductoToOrden = async (orden_id, producto_id, cantidad) => {
    const query = `
        INSERT INTO ordenes_productos (orden_id, producto_id, cantidad)
        VALUES ($1, $2, $3)
        RETURNING *;
    `;
    const result = await pool.query(query, [orden_id, producto_id, cantidad]);
    return result.rows[0];
};

// Obtener los productos por el ID de la orden
const getProductosByOrdenId = async (orden_id) => {
    const query = `
        SELECT op.id, p.titulo, p.precio, op.cantidad
        FROM ordenes_productos op
        INNER JOIN productos p ON op.producto_id = p.id
        WHERE op.orden_id = $1;
    `;
    const result = await pool.query(query, [orden_id]);
    return result.rows;
};

// Eliminar un producto de la orden
const removeProductoFromOrden = async (id) => {
    const query = `
        DELETE FROM ordenes_productos
        WHERE id = $1;
    `;
    const result = await pool.query(query, [id]);
    return result.rowCount > 0;
};

module.exports = { addProductoToOrden, getProductosByOrdenId, removeProductoFromOrden };
