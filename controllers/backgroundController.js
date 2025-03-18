const backgroundModel = require("../models/backgroundModel");

const uploadBackground = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No se ha subido ninguna imagen" });
    }

    const imagePath = `/public/background/${req.file.filename}`;
    const background = await backgroundModel.saveBackground(imagePath);

    res.json({ message: "Imagen de fondo subida correctamente", background });
  } catch (error) {
    console.error("Error al subir la imagen de fondo:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

const getBackground = async (req, res) => {
  try {
    const background = await backgroundModel.getBackground();
    if (!background) {
      return res.status(404).json({ message: "No hay imagen de fondo disponible" });
    }
    res.json({ background });
  } catch (error) {
    console.error("Error al obtener la imagen de fondo:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

const getAllBackgrounds = async (req, res) => {
    try {
      const backgrounds = await backgroundModel.getAllBackgrounds();
      res.json({ backgrounds });
    } catch (error) {
      console.error("Error al obtener las imágenes de fondo:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  };
  

module.exports = { uploadBackground, getBackground, getAllBackgrounds };
