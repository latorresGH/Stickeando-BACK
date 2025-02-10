const carritoProductosModel = require('../models/carritoProductosModel');
const pool = require('../config/database/db')

// Lógica en el backend para agregar un producto al carrito
const addProductoToCarrito = async (req, res) => {
    const { carrito_id, producto_id, cantidad } = req.body;

    try {
        if (!carrito_id || !producto_id || cantidad <= 0) {
            return res.status(400).json({ message: 'Datos inválidos' });
        }

        const queryCheck = `
            SELECT id, cantidad FROM carrito_productos WHERE carrito_id = $1 AND producto_id = $2;
        `;
        const existingProduct = await pool.query(queryCheck, [carrito_id, producto_id]);

        if (existingProduct.rowCount > 0) {
            const newCantidad = existingProduct.rows[0].cantidad + cantidad;
            const queryUpdate = `
                UPDATE carrito_productos SET cantidad = $1 WHERE id = $2 RETURNING *;
            `;
            const result = await pool.query(queryUpdate, [newCantidad, existingProduct.rows[0].id]);
            return res.status(201).json({ message: 'Producto actualizado en el carrito', producto: result.rows[0] });
        } else {
            const queryInsert = `
                INSERT INTO carrito_productos (carrito_id, producto_id, cantidad)
                VALUES ($1, $2, $3) RETURNING *;
            `;
            const result = await pool.query(queryInsert, [carrito_id, producto_id, cantidad]);
            return res.status(201).json({ message: 'Producto agregado al carrito', producto: result.rows[0] });
        }
    } catch (error) {
        console.error('Error detallado:', error);  // Agrega más detalles al error
        res.status(500).json({ message: 'Error al agregar producto al carrito', error: error.message });
    }
};



const removeProductoFromCarrito = async (req, res) => {
    const { carrito_id, producto_id } = req.params; // Usamos req.params para acceder a los parámetros en la URL
    console.log('Carrito ID:', carrito_id); // Verificar valores
    console.log('Producto ID:', producto_id);
    
    try {
      if (!carrito_id || !producto_id) {
        return res.status(400).json({ message: 'Faltan parámetros' });
      }
  
      const result = await carritoProductosModel.removeProductoFromCarrito(carrito_id, producto_id);
      if (result) {
        res.json({ message: 'Producto eliminado del carrito' });
      } else {
        res.status(404).json({ message: 'Producto no encontrado en el carrito', carrito_id, producto_id });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error al eliminar producto del carrito', error: error.message });
    }
  };
  
  

const getProductosByCarritoId = async (req, res) => {
    const { carrito_id } = req.params;

    try {
        if (!carrito_id) {
            return res.status(400).json({ message: 'Falta el carrito_id' });
        }

        const productos = await carritoProductosModel.getProductosByCarritoId(carrito_id);

        if (productos.length === 0) {
            return res.status(200).json({ message: 'El carrito está vacío', productos });
        }

        res.json(productos);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener productos del carrito', error: error.message });
    }
};

module.exports = { addProductoToCarrito, removeProductoFromCarrito, getProductosByCarritoId };
