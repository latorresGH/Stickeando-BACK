const { registerUser, loginUser, updateUserProfile } = require('../controllers/userController')
const express = require('express');
const router = express.Router();

//ruta para registrarme
router.post("/register", registerUser);

router.post('/login', loginUser);

router.put('/update', updateUserProfile);

module.exports = router; // -----------------> exportamos las rutas