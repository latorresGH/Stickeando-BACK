const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { upload } = require('../config/cloudinary/cloudinary'); // Importamos configuración de Cloudinary
const productModel = require('../models/productModel');
const authenticate = require('../middleware/authenticate'); // Middleware de autenticación
const isAdmin = require('../middleware/isAdmin'); // Middleware de autorización (rol de admin)


// Ruta para crear un producto (solo administradores)
// router.post('/create', authenticate, isAdmin, upload.single('imagen_url'), productController.createProduct);
// router.post('/create', authenticate, isAdmin, upload.single('imagen'), productController.createProduct);
router.post('/create', upload.single('imagen'), createProductController);
// Ruta para actualizar un producto (solo administradores)
router.put('/update/:id', authenticate, isAdmin, upload.single('imagen_url'), productController.updateProduct);

// Ruta para eliminar un producto (solo administradores)
router.delete('/delete/:id', authenticate, isAdmin, productController.deleteProduct);

//Ruta para obtener la lsita de productos
router.get('/list', productController.listProducts);

router.get('/listar', productController.getProducts);

router.get('/:id', productController.getProductController);

module.exports = router;