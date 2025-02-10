const pool = require('../config/database/db.js');

// Crear carrito al registrar un usuario
const createCarrito = async (usuario_id) => {
    const result = await pool.query(
        `INSERT INTO carritos (usuario_id, creado_en) 
         VALUES ($1, NOW()) 
         RETURNING *`,
        [usuario_id]
    );
    return result.rows[0];
};

// Obtener el carrito de un usuario
const getCarritoByUserId = async (usuario_id) => {
    // Obtener el carrito del usuario
    const carritoResult = await pool.query(
      "SELECT * FROM carritos WHERE usuario_id = $1",
      [usuario_id]
    );
    
    const carrito = carritoResult.rows[0] || null;
  
    if (carrito) {
      // Obtener los productos asociados al carrito
      const productosResult = await pool.query(
        `SELECT p.id, p.titulo, p.precio, p.imagen_url, cp.cantidad 
         FROM productos p
         JOIN carrito_productos cp ON p.id = cp.producto_id
         WHERE cp.carrito_id = $1`,
        [carrito.id]
      );
  
      // Añadir los productos al carrito
      carrito.productos = productosResult.rows;
    }
  
    return carrito;
  };
  

// Eliminar un carrito
const deleteCarrito = async (id) => {
    const result = await pool.query(
        "DELETE FROM carritos WHERE id = $1",
        [id]
    );
    return result.rowCount > 0;
};

module.exports = { createCarrito, getCarritoByUserId, deleteCarrito };
