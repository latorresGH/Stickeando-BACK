const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate'); // Asegúrate de tener la ruta correcta al middleware
const User = require('../models/userModel');

// Ruta para obtener la información del usuario autenticado
router.get('/auth/me', authenticate, async (req, res) => {
    try {
        console.log('Token decodificado:', req.user); // Verifica qué contiene req.user
        const user = await User.getUserById(req.user.id);
        if (!user) {
            console.error('Usuario no encontrado');
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json({
            id: user.id,
            email: user.email,
            nombre: user.nombre,
            foto_perfil: user.foto_perfil,
            rol: user.rol,
        });
    } catch (error) {
        console.error('Error al obtener el usuario:', error);
        res.status(500).json({ message: 'Error al obtener los datos del usuario' });
    }
});


module.exports = router;
