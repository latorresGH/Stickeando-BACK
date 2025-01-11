const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// Servir imágenes de productos desde la carpeta 'stickeando-backend/imagenProducto/'
// Servir imágenes de productos desde la carpeta 'stickeando-backend/imagenProducto/'
router.use('/imagenProducto', express.static(path.join(__dirname, 'imagenProducto')));

// Verificar si el archivo existe antes de intentar servirlo
router.get('/imagenProducto/:filename', (req, res) => {
  const filePath = path.join(__dirname, '../imagenProducto', req.params.filename);
  
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).send('Imagen de producto no encontrada');
    }
    res.sendFile(filePath);
  });
});


module.exports = router;
