const carritoProductosModel = require('../models/carritoProductosModel');

const addProductoToCarrito = async (req, res) => {
    const { carrito_id, producto_id, cantidad } = req.body;

    try {
        const producto = await carritoProductosModel.addProductoToCarrito(carrito_id, producto_id, cantidad);
        res.status(201).json({ message: 'Producto agregado al carrito', producto });
    } catch (error) {
        res.status(500).json({ message: 'Error al agregar producto al carrito', error: error.message });
    }
};

const removeProductoFromCarrito = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await carritoProductosModel.removeProductoFromCarrito(id);
        if (result) {
            res.json({ message: 'Producto eliminado del carrito' });
        } else {
            res.status(404).json({ message: 'Producto no encontrado en el carrito' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar producto del carrito', error: error.message });
    }
};

const getProductosByCarritoId = async (req, res) => {
    const { carrito_id } = req.params;

    try {
        const productos = await carritoProductosModel.getProductosByCarritoId(carrito_id);
        res.json(productos);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener productos del carrito', error: error.message });
    }
};

module.exports = { addProductoToCarrito, removeProductoFromCarrito, getProductosByCarritoId };
