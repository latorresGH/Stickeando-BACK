const express = require('express');
const router = express.Router();
const carritoProductosController = require('../controllers/carritoProductosController');

// Agregar producto al carrito
router.post('/add', carritoProductosController.addProductoToCarrito);

// Eliminar producto del carrito
router.delete('/remove/:id', carritoProductosController.removeProductoFromCarrito);

// Obtener productos de un carrito
router.get('/:carrito_id', carritoProductosController.getProductosByCarritoId);

module.exports = router;
