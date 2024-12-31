const path = require('path');
const express = require('express');
const router = express.Router();
const fs = require('fs');

// Ruta estática para servir imágenes
router.use('/images', express.static(path.join(__dirname, 'public/images')));

// Verificar si el archivo existe antes de intentar servirlo
router.get('/images/profile/:filename', (req, res) => {
  const filePath = path.join(__dirname, '../public/images/profile', req.params.filename);
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).send('Imagen no encontrada');
    }
    res.sendFile(filePath);
  });
});

module.exports = router;


module.exports = router;