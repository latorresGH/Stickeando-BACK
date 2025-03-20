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

    // Guardar la ruta correcta en la base de datos (sin "/public")
    const imageUrl = `/background/${filename}`;

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

    console.log("Resultado de la consulta:", result.rows); // <-- 🔴 Muestra lo que devuelve la DB

    if (result.rows.length === 0) {
      console.log("⚠️ No se encontró una imagen seleccionada.");
      return res.status(404).json({ error: "Imagen no encontrada" });
    }

    let imageUrl = result.rows[0].image_url;
    console.log("URL original en la DB:", imageUrl); // <-- 🔴 Verifica la URL antes de modificarla

    // Remover "/public" si está en la ruta
    imageUrl = imageUrl.replace("/public", "");
    console.log("URL después de modificarla:", imageUrl); // <-- 🔴 Verifica la URL corregida

    // Asegurar que la URL sea accesible desde el frontend
    imageUrl = `https://stickeando.onrender.com/api${imageUrl}`;

    console.log("URL final enviada al frontend:", imageUrl); // <-- 🔴 Verifica la URL final

    res.json({ imageUrl });
  } catch (error) {
    console.error("❌ Error al obtener la imagen seleccionada:", error);
    res.status(500).json({ error: "Error al obtener la imagen de fondo" });
  }
});


  
  
  
  
  
  
  

module.exports = router;

