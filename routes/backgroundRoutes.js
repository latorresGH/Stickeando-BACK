const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadBackground");
const backgroundController = require("../controllers/backgroundController");
const path = require("path");
const fs = require("fs");

const selectedBackgroundPath = path.join(__dirname, "../public/background/selectedBackground.txt");

// Servir imágenes desde la carpeta 'public/background'
router.use('/backgrounds', express.static(path.join(__dirname, '../public/background')));

// Subir una nueva imagen de fondo
router.post("/backgrounds", upload.single("background"), backgroundController.uploadBackground);

// Obtener una imagen específica
router.get('/backgrounds/:filename', (req, res) => {
  const filePath = path.join(__dirname, '../public/background', req.params.filename);
  if (!fs.existsSync(filePath)) {
    return res.status(404).send("Imagen no encontrada");
  }
  res.sendFile(filePath);
});

// Obtener lista de imágenes disponibles
router.get("/backgrounds/list", (req, res) => {
  const directoryPath = path.join(__dirname, "../public/background");
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      return res.status(500).json({ error: "Error al leer el directorio de imágenes" });
    }
    const images = files.filter(file => file.match(/\.(jpg|jpeg|png|gif)$/i));
    res.json({ backgrounds: images });
  });
});

// Seleccionar un fondo
router.post("/backgrounds/selected", (req, res) => {
  const { filename } = req.body;
  if (!filename) return res.status(400).json({ error: "Falta el nombre del archivo" });

  fs.writeFile(selectedBackgroundPath, filename, (err) => {
    if (err) return res.status(500).json({ error: "Error al guardar la imagen seleccionada" });
    res.json({ message: "Fondo actualizado con éxito" });
  });
});

// Obtener el fondo seleccionado
router.get("/backgrounds/selected", (req, res) => {
  if (!fs.existsSync(selectedBackgroundPath)) {
    return res.json({ imageUrl: "/backgrounds/default.jpg" }); // Imagen por defecto
  }

  fs.readFile(selectedBackgroundPath, "utf8", (err, filename) => {
    if (err) return res.status(500).json({ error: "Error al leer la imagen seleccionada" });

    const imageUrl = `/backgrounds/${filename.trim()}`;
    res.json({ imageUrl });
  });
});

module.exports = router;