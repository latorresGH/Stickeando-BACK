const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadBackground");
const backgroundController = require("../controllers/backgroundController");
const path = require("path");
const fs = require("fs");

const selectedBackgroundPath = path.join(__dirname, "../public/background/selectedBackground.json");

// Ruta estática para servir imágenes desde la carpeta 'public/background'
router.use('/background', express.static(path.join(__dirname, '../public/background')));

router.post("/background", upload.single("background"), backgroundController.uploadBackground);

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

// Obtener lista de imágenes disponibles
router.get("/backgrounds", (req, res) => {
  const directoryPath = path.join(__dirname, "../public/background");
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      return res.status(500).json({ error: "Error al leer el directorio de imágenes" });
    }
    const images = files.filter(file => file.match(/\.(jpg|jpeg|png|gif)$/i));
    res.json({ backgrounds: images });
  });
});

// Guardar el fondo seleccionado
router.post("/background/selected", (req, res) => {
  const { imageUrl } = req.body;
  if (!imageUrl) return res.status(400).json({ error: "Falta la URL de la imagen" });

  const selectedImagePath = `/background/${imageUrl}`; // Guarda solo el nombre del archivo

  fs.writeFile(selectedBackgroundPath, JSON.stringify({ imageUrl: selectedImagePath }), (err) => {
    if (err) return res.status(500).json({ error: "Error al guardar la imagen" });
    res.json({ message: "Fondo actualizado con éxito" });
  });
});

// Obtener el fondo seleccionado
router.get("/background/selected", (req, res) => {
  if (!fs.existsSync(selectedBackgroundPath)) {
    return res.json({ imageUrl: "/background/default.jpg" });
  }

  fs.readFile(selectedBackgroundPath, (err, data) => {
    if (err) return res.status(500).json({ error: "Error al leer el fondo" });

    try {
      const { imageUrl } = JSON.parse(data);
      res.json({ imageUrl });
    } catch (parseError) {
      res.status(500).json({ error: "Error al parsear el fondo" });
    }
  });
});

module.exports = router;
