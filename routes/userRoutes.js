const { registerUser, loginUser, updateUserProfile, getUserProfilePhoto } = require('../controllers/userController')
const express = require('express');
const router = express.Router();

//ruta para registrarme
router.post("/register", registerUser);

router.post('/login', loginUser);

router.put('/update', updateUserProfile);

router.get('/photo/:id', getUserProfilePhoto);


router.post("/logout", (req, res) => {
    res.clearCookie("token"); // Elimina la cookie de autenticación
    res.status(200).json({ message: "Sesión cerrada exitosamente" });
  });

module.exports = router; // -----------------> exportamos las rutas