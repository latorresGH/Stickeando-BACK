const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadBackground");
const backgroundController = require("../controllers/backgroundController");
const path = require("path"); // Importa el módulo 'path'
const fs = require("fs"); // Importa el módulo 'fs'

// Ruta estática para servir imágenes desde la carpeta 'public/background'
router.use('/background', express.static(path.join(__dirname, '../public/background')));

router.post("/background", upload.single("background"), backgroundController.uploadBackground);
router.get("/background", backgroundController.getBackground);
router.get("/backgrounds", backgroundController.getAllBackgrounds);

// No necesitas esta ruta si ya usas express.static, pero si decides hacerlo manualmente:
router.get('/background/:filename', (req, res) => {
  const filePath = path.join(__dirname, '../public/background', req.params.filename);
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).send('Imagen no encontrada');
    }
    res.sendFile(filePath);
  });
});

module.exports = router;
