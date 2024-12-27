// controllers/ordenesController.js
const ordenesModel = require('../models/ordenesModel');
const ordenesProductosModel = require('../models/ordenesProductosModel');

// Crear una nueva orden
const createOrden = async (req, res) => {
    const { usuario_id, total } = req.body;

    try {
        const orden = await ordenesModel.createOrden(usuario_id, total);
        res.status(201).json({ message: 'Orden creada con éxito', orden });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear la orden', error: error.message });
    }
};

// Obtener todas las órdenes de un usuario
const getOrdenesByUsuario = async (req, res) => {
    const { usuario_id } = req.params;

    try {
        const ordenes = await ordenesModel.getOrdenesByUsuarioId(usuario_id);
        res.json(ordenes);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las órdenes', error: error.message });
    }
};

// Agregar productos a la orden
const addProductoToOrden = async (req, res) => {
    const { orden_id, producto_id, cantidad } = req.body;

    try {
        const productoOrden = await ordenesProductosModel.addProductoToOrden(orden_id, producto_id, cantidad);
        res.status(201).json({ message: 'Producto agregado a la orden', productoOrden });
    } catch (error) {
        res.status(500).json({ message: 'Error al agregar producto a la orden', error: error.message });
    }
};

// Verificar los productos en una orden
const getProductosByOrdenId = async (req, res) => {
    const { orden_id } = req.params;

    try {
        const productos = await ordenesProductosModel.getProductosByOrdenId(orden_id);
        res.json(productos);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los productos de la orden', error: error.message });
    }
};

// Eliminar un producto de la orden
const removeProductoFromOrden = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await ordenesProductosModel.removeProductoFromOrden(id);
        if (result) {
            res.json({ message: 'Producto eliminado de la orden' });
        } else {
            res.status(404).json({ message: 'Producto no encontrado en la orden' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar producto de la orden', error: error.message });
    }
};

module.exports = { createOrden, getOrdenesByUsuario, addProductoToOrden, getProductosByOrdenId, removeProductoFromOrden };
