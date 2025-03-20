const express = require('express');
const router = express.Router();
const pool = require('../config/database/db'); // Conexión a PostgreSQL
const multer = require('multer');
const path = require('path');

// Configurar almacenamiento con multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Carpeta donde se guardarán las imágenes
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Nombre único para cada imagen
    }
});
const upload = multer({ storage });

// 🔹 Obtener todos los backgrounds
router.get('/backgrounds', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM backgrounds');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener backgrounds' });
    }
});

// 🔹 Obtener el background seleccionado
router.get('/backgrounds/selected', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM backgrounds WHERE is_selected = true LIMIT 1');
        res.json(result.rows[0] || null);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el background seleccionado' });
    }
});

// 🔹 Seleccionar un background
router.put('/backgrounds/:id/select', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('UPDATE backgrounds SET is_selected = false');
        await pool.query('UPDATE backgrounds SET is_selected = true WHERE id = $1', [id]);
        res.json({ message: 'Background seleccionado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al seleccionar el background' });
    }
});

// 🔹 Subir y agregar un nuevo background
router.post('/backgrounds', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No se subió ninguna imagen' });
    }

    const imageUrl = `/uploads/${req.file.filename}`; // Ruta de la imagen guardada
    try {
        const result = await pool.query(
            'INSERT INTO backgrounds (image_url, is_selected) VALUES ($1, false) RETURNING *',
            [imageUrl]
        );
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar el background' });
    }
});

// 🔹 Eliminar un background
router.delete('/backgrounds/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM backgrounds WHERE id = $1', [id]);
        res.json({ message: 'Background eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el background' });
    }
});

module.exports = router;
