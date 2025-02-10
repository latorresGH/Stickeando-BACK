const express = require('express');
const router = express.Router();
const carritoProductosController = require('../controllers/carritoProductosController');

// Agregar producto al carrito
router.post('/add', carritoProductosController.addProductoToCarrito);

// Eliminar producto del carrito
// Cambia la ruta para recibir los parámetros desde req.params
router.delete('/remove/:carrito_id/:producto_id', carritoProductosController.removeProductoFromCarrito);


// Obtener productos de un carrito
router.get('/:carrito_id', carritoProductosController.getProductosByCarritoId);

module.exports = router;
