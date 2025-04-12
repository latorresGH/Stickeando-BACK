const jwt = require('jsonwebtoken');

// Usar la clave secreta del archivo .env
const secretKey = process.env.JWT_SECRET; 

const authenticate = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1]; // Obtener solo el token después de 'Bearer'

    if (!token) {
        console.log('No se proporcionó token'); // Registro cuando no hay token
        return res.status(401).json({ message: 'Acceso no autorizado, token requerido' });
    }

    try {
        // Verificamos el token
        const decoded = jwt.verify(token, secretKey);
        console.log('Decoded token:', decoded); // Registra el contenido del token decodificado
        req.user = decoded; // Almacenamos los datos del usuario decodificados en 'req.user'
        next(); // Si el token es válido, pasamos al siguiente middleware o controlador
    } catch (error) {
        console.log('Error al verificar el token:', error); // Registra si hay un error al verificar el token
        res.status(401).json({ message: 'Token no válido o expirado' });
    }
};



module.exports = authenticate;
