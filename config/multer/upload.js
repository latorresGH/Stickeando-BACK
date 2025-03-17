const multer = require('multer');
const path = require('path');
const sharp = require('sharp'); // Importa Sharp

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

// Middleware para recortar y redimensionar la imagen
const cropImage = (req, res, next) => {
    if (!req.file) {
        return next(); // Si no hay archivo, no hacemos nada
    }

    const filePath = path.join(__dirname, '../../imagenProducto', req.file.filename); // Ruta completa al archivo subido
    
    // Usamos sharp para redimensionar la imagen manteniendo la proporción y luego recortamos al centro
    sharp(filePath)
        .resize(250, 250, { fit: sharp.fit.cover, position: sharp.position.center }) // Redimensiona y recorta desde el centro sin distorsionar
        .toFile(filePath, (err, info) => { // Sobrescribe el archivo original con la imagen procesada
            if (err) {
                return next(err); // Si hay un error, pasamos al siguiente middleware con el error
            }
            console.log('Imagen recortada y redimensionada a 250x250px', info);
            next(); // Continúa con el siguiente middleware
        });
};

// Middleware de multer para subir las imágenes
const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 1024 * 1024 * 5 }, // Limite de tamaño: 5MB
}).single('image'); // Cambia 'image' por el nombre del campo en tu formulario

module.exports = { upload, cropImage };