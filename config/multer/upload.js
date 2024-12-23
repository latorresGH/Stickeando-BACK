const multer = require('multer');
const path = require('path');

// Configuración del almacenamiento
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'imagenProducto/'); // Carpeta donde se guardarán las imágenes
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

// Filtro para validar imágenes
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Solo se permiten archivos JPG, JPEG o PNG'), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 1024 * 1024 * 5 }, // Limite de tamaño: 5MB
});

module.exports = upload;
