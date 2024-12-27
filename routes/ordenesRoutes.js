// routes/ordenesRoutes.js
const express = require('express');
const router = express.Router();
const ordenesController = require('../controllers/ordenesController');

// Crear una nueva orden
router.post('/create', ordenesController.createOrden);

// Obtener todas las órdenes de un usuario
router.get('/:usuario_id', ordenesController.getOrdenesByUsuario);

// Agregar productos a la orden
router.post('/productos/add', ordenesController.addProductoToOrden);

// Verificar los productos en una orden
router.get('/productos/:orden_id', ordenesController.getProductosByOrdenId);

// Eliminar un producto de la orden
router.delete('/productos/:id', ordenesController.removeProductoFromOrden);

module.exports = router;
