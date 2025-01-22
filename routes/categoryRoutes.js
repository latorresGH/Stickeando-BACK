const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const isAdmin = require('../middleware/isAdmin');
const authenticate = require('../middleware/authenticate')

// Ruta para crear una categoría (solo administradores)
router.post('/create', authenticate, isAdmin, categoryController.createCategory);

// Ruta para eliminar una categoría (solo administradores)
router.delete('/delete/:id', authenticate, isAdmin, categoryController.deleteCategory);

// Ruta para obtener todas las categorías (accesible para todos)
router.get('/all', categoryController.getCategories);

module.exports = router;