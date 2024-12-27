const carritoModel = require('../models/carritoModel');

const createCarrito = async (req, res) => {
    const { usuario_id } = req.body;

    try {
        const carrito = await carritoModel.createCarrito(usuario_id);
        res.status(201).json({
            message: "Carrito creado exitosamente",
            carrito
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            message: "Error al crear el carrito",
            error: error.message
        });
    }
};

const getCarritoById = async (req, res) => {
    const { id } = req.params;

    try {
        const carrito = await carritoModel.getCarritoById(id);
        if (!carrito) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }
        res.json(carrito);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el carrito', error: error.message });
    }
};

const deleteCarrito = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await carritoModel.deleteCarrito(id);
        if (result) {
            res.json({ message: 'Carrito eliminado exitosamente' });
        } else {
            res.status(404).json({ message: 'Carrito no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el carrito', error: error.message });
    }
};

module.exports = { createCarrito, getCarritoById, deleteCarrito };
