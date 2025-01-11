const express = require('express');
const router = express.Router();
const upload = require('../config/multer/upload');
const productController = require('../controllers/productController');
const productModel = require('../models/productModel');
const authenticate = require('../middleware/authenticate'); // Middleware de autenticación
const isAdmin = require('../middleware/isAdmin'); // Middleware de autorización (rol de admin)


// Ruta para crear un producto (solo administradores)
router.post('/create', authenticate, isAdmin, upload.single('imagen_url'), productController.createProduct);

// Ruta para actualizar un producto (solo administradores)
router.put('/update/:id', authenticate, isAdmin, upload.single('imagen_url'), productController.updateProduct);

// Ruta para eliminar un producto (solo administradores)
router.delete('/delete/:id', authenticate, isAdmin, productController.deleteProduct);

//Ruta para obtener la lsita de productos
router.get('/list', productController.listProducts);

router.get('/listar', productController.getProducts);

module.exports = router;