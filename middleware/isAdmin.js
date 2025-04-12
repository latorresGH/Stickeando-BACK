const isAdmin = (req, res, next) => {
    console.log('Usuario actual:', req.user); // Verifica todo el objeto de usuario (debería tener al menos `rol`)
    console.log('Rol del usuario:', req.user?.rol); // Verifica específicamente el rol del usuario
    
    if (req.user && req.user.rol === 'administrador') {
        return next(); // Si el rol es admin, dejamos pasar la solicitud
    }

    // Si no tiene el rol de admin, respondemos con un error 403 (Prohibido)
    return res.status(403).json({ message: 'No autorizado. Debes ser un administrador para acceder a esta ruta.' });
};


module.exports = isAdmin;
