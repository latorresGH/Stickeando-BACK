const express = require('express');
const router = express.Router();
const carritoController = require('../controllers/carritoController');

// Crear un nuevo carrito
router.post('/create', carritoController.createCarrito);

// Obtener un carrito por ID
router.get('/:id', carritoController.getCarritoById);

// Eliminar un carrito
router.delete('/:id', carritoController.deleteCarrito);

module.exports = router;
