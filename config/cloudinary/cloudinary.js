const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// 🔹 Configurar Cloudinary con variables de entorno
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 🔹 Configurar el almacenamiento en Cloudinary con Multer
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'backgrounds', // Carpeta donde se guardarán las imágenes en Cloudinary
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'], // Formatos permitidos
    },
});

const upload = multer({ storage }); // Inicializar Multer con Cloudinary

module.exports = { cloudinary, upload };
