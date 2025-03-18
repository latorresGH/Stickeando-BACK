const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadBackground");
const backgroundController = require("../controllers/backgroundController");
const path = require("path");
const fs = require("fs");
const db = require("../config/database/db")

// const selectedBackgroundPath = path.join(__dirname, "../public/background/selectedBackground.txt");

// Ruta estática para servir imágenes desde la carpeta 'public/background'
router.use('/background', express.static(path.join(__dirname, '../public/background')));

router.post("/background", upload.single("background"), backgroundController.uploadBackground);

// No necesitas esta ruta si ya usas express.static, pero si decides hacerlo manualmente:
router.get('/background/:filename', (req, res) => {
  const filePath = path.join(__dirname, '../public/background', req.params.filename);
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).send('Imagen no encontrada porque ', err);
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

router.post("/background/selected", (req, res) => {
  const { filename } = req.body;
  if (!filename) return res.status(400).json({ error: "Falta el nombre del archivo" });

  fs.writeFile(selectedBackgroundPath, filename, (err) => {
    if (err) return res.status(500).json({ error: "Error al guardar la imagen seleccionada" });
    res.json({ message: "Fondo actualizado con éxito" });
  });
});



router.put("/background/selected", async (req, res) => {
    const { filename } = req.body;
    if (!filename) return res.status(400).json({ error: "Falta el nombre del archivo" });
  
    try {
      // Desmarcar cualquier imagen seleccionada
      await db.query("UPDATE backgrounds SET is_selected = FALSE");
  
      // Concatenar el prefijo '/public/background/' al nombre del archivo
      const imageUrl = `/public/background/${filename}`;
  
      // Marcar la nueva imagen como seleccionada
      await db.query("UPDATE backgrounds SET is_selected = TRUE WHERE image_url = $1", [imageUrl]);
  
      res.json({ message: "Fondo actualizado con éxito" });
    } catch (error) {
      console.error("Error al actualizar el fondo:", error);
      res.status(500).json({ error: "Error al actualizar la imagen de fondo" });
    }
  });
  



  router.get("/background/selected", async (req, res) => {
    try {
      const result = await db.query("SELECT image_url FROM backgrounds WHERE is_selected = TRUE LIMIT 1");
  
      if (result.rows.length === 0) {
        return res.json({ imageUrl: "/api/background/default.jpg" }); // Imagen por defecto
      }
  
      let imageUrl = result.rows[0].image_url; 
      res.json({ imageUrl: imageUrl }); // Devolver la URL completa de la imagen seleccionada
    } catch (error) {
      console.error("Error al obtener la imagen seleccionada:", error);
      res.status(500).json({ error: "Error al obtener la imagen de fondo", details: error.message });
    }
  });
  
  
  
  
  
  
  

module.exports = router;

