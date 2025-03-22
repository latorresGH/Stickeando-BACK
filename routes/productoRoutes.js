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
router.post('/create', upload.single('imagen'), productController.createProduct);
// Ruta para actualizar un producto (solo administradores)
router.put('/update/:id', authenticate, isAdmin, upload.single('imagen_url'), productController.updateProduct);

// Ruta para eliminar un producto (solo administradores)
router.delete('/delete/:id', authenticate, isAdmin, productController.deleteProduct);

//Ruta para obtener la lsita de productos
router.get('/list', productController.listProducts);

router.get('/listar', productController.getProducts);

router.get('/:id', productController.getProductController);

router.put("/actualizar-producto", async (req, res) => {
    try {
      const { carrito_id, producto_id, cantidad } = req.body;
  
      const resultado = await pool.query(
        "UPDATE carrito_productos SET cantidad = $1 WHERE carrito_id = $2 AND producto_id = $3 RETURNING *",
        [cantidad, carrito_id, producto_id]
      );
  
      if (resultado.rowCount === 0) {
        return res.status(404).json({ mensaje: "Producto no encontrado en el carrito" });
      }
  
      res.json({ mensaje: "Cantidad actualizada", producto: resultado.rows[0] });
    } catch (error) {
      console.error("Error al actualizar producto en carrito:", error);
      res.status(500).json({ mensaje: "Error interno del servidor" });
    }
  });
  

module.exports = router;