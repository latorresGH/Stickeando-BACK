const multer = require("multer");
const path = require("path");

// Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/background/"); // Carpeta donde se guardará la imagen
  },
  filename: (req, file, cb) => {
    cb(null, `background-${Date.now()}${path.extname(file.originalname)}`);
  },
});

// Filtro para validar imágenes
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Solo se permiten archivos JPG, JPEG o PNG"), false);
  }
};

// Configurar Multer
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5MB de límite
});

module.exports = upload;
