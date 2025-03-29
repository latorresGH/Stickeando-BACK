const express = require('express');
const router = express.Router();
const carritoController = require('../controllers/carritoController');

// Crear un nuevo carrito
router.post('/create', carritoController.createCarrito);

// Obtener un carrito por ID
router.get("/carrito/:usuario_id", carritoController.getCarrito);

// Eliminar un carrito
router.delete('/carrito/:id', carritoController.deleteCarrito);



module.exports = router;
