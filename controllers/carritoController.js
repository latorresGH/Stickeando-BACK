const carritoModel = require('../models/carritoModel');
const carritoProductosModel = require('../models/carritoProductosModel');
const pool = require('../config/database/db'); // Importar la conexión a la base de datos que creamos el archivo db.js

// Crear carrito (Solo se usa cuando se registra un usuario)
const createCarrito = async (usuario_id) => {
    try {
        const carrito = await carritoModel.createCarrito(usuario_id);
        return carrito;
    } catch (error) {
        console.error("Error al crear el carrito:", error.message);
        throw new Error("Error al crear el carrito");
    }
};

// carritoController.js
const getCarrito = async (req, res) => {
  const { usuario_id } = req.params; // Obtener el usuario_id de los parámetros de la URL
  
  try {
    // Verificamos que el usuario_id esté presente
    if (!usuario_id) {
      return res.status(400).json({ message: "Falta el usuario_id" });
    }

    // Obtener el carrito del usuario
    const carrito = await carritoModel.getCarritoByUserId(usuario_id);

    // Si no se encuentra el carrito, devolvemos un error
    if (!carrito) {
      return res.status(404).json({ message: "Carrito no encontrado" });
    }

    // Obtener los productos asociados al carrito usando el carrito.id
    const productos = await carritoProductosModel.getProductosByCarritoId(carrito.id);

    // Devolver el carrito y los productos en la respuesta
    res.json({ carrito, productos });
  } catch (error) {
    // Manejo de errores si algo sale mal
    console.error("Error al obtener el carrito:", error.message);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

  

// Eliminar carrito de un usuario
const deleteCarrito = async (req, res) => {
    const { id } = req.params;

    try {
        await pool.query("DELETE FROM carrito_productos WHERE carrito_id = $1", [id]);

        const result = await carritoModel.deleteCarrito(id);
        if (result) {
            res.json({ message: "Carrito eliminado exitosamente" });
        } else {
            res.status(404).json({ message: "Carrito no encontrado" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar el carrito", error: error.message });
    }
};

module.exports = { createCarrito, getCarrito, deleteCarrito };
