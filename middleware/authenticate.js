const jwt = require('jsonwebtoken');

// Usar la clave secreta del archivo .env
const secretKey = process.env.JWT_SECRET; 

const authenticate = (req, res, next) => {
    const token = req.header('Authorization'); // El token debe estar en el encabezado 'Authorization'

    if (!token) {
        return res.status(401).json({ message: 'Acceso no autorizado, token requerido' });
    }

    try {
        // Verificamos el token
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded; // Almacenamos los datos del usuario decodificados en 'req.user'
        next(); // Si el token es válido, pasamos al siguiente middleware o controlador
    } catch (error) {
        res.status(401).json({ message: 'Token no válido o expirado' });
    }
};

module.exports = authenticate;
