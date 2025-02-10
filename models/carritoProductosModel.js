const pool = require('../config/database/db')

// Agregar producto al carrito (actualiza si ya existe)
const addProductoToCarrito = async (carrito_id, producto_id, cantidad) => {
    const queryCheck = `
        SELECT id, cantidad FROM carrito_productos
        WHERE carrito_id = $1 AND producto_id = $2;
    `;

    const existingProduct = await pool.query(queryCheck, [carrito_id, producto_id]);

    if (existingProduct.rowCount > 0) {
        // Si el producto ya está en el carrito, sumamos la cantidad
        const newCantidad = existingProduct.rows[0].cantidad + cantidad;
        const queryUpdate = `
            UPDATE carrito_productos
            SET cantidad = $1
            WHERE id = $2
            RETURNING *;
        `;
        const result = await pool.query(queryUpdate, [newCantidad, existingProduct.rows[0].id]);
        return result.rows[0];
    } else {
        // Si no está en el carrito, lo insertamos
        const queryInsert = `
            INSERT INTO carrito_productos (carrito_id, producto_id, cantidad)
            VALUES ($1, $2, $3)
            RETURNING *;
        `;
        const result = await pool.query(queryInsert, [carrito_id, producto_id, cantidad]);
        return result.rows[0];
    }
};

// Eliminar un producto del carrito por carrito_id y producto_id
const removeProductoFromCarrito = async (carrito_id, producto_id) => {
    console.log("Ejecutando DELETE con", carrito_id, producto_id); // Verifica que los parámetros sean correctos
    const query = `
      DELETE FROM carrito_productos
      WHERE carrito_id = $1 AND producto_id = $2;
    `;
    const result = await pool.query(query, [carrito_id, producto_id]);
    console.log("Resultado de la consulta:", result); // Verifica el resultado de la consulta
    return result.rowCount > 0; // Verifica que haya filas eliminadas
  };
  

// Obtener los productos de un carrito
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
