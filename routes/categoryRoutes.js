const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const isAdmin = require('../middleware/isAdmin');

// Ruta para crear una categoría (solo administradores)
router.post('/create', isAdmin, categoryController.createCategory);

// Ruta para eliminar una categoría (solo administradores)
router.delete('/delete/:id', isAdmin, categoryController.deleteCategory);

module.exports = router;