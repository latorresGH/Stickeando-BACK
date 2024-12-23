const isAdmin = (req, res, next) => {
    // Verificamos que el usuario tenga el rol de admin
    if (req.user && req.user.role === 'administrador') {
        return next(); // Si el rol es admin, dejamos pasar la solicitud
    }

    // Si no tiene el rol de admin, respondemos con un error 403 (Prohibido)
    return res.status(403).json({ message: 'No autorizado. Debes ser un administrador para acceder a esta ruta.' });
};

module.exports = isAdmin;
