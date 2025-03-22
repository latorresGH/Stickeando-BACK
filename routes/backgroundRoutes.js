const express = require('express');
const router = express.Router();
const pool = require('../config/database/db'); 
const { upload, cloudinary } = require('../config/cloudinary/cloudinary'); // Importar configuración de Cloudinary

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

// 🔹 Subir un nuevo background
router.post('/backgrounds', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No se subió ninguna imagen' });
    }

    const imageUrl = req.file.path; // URL generada por Cloudinary
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
        // 🔹 Buscar la URL de la imagen en la base de datos
        const background = await pool.query('SELECT image_url FROM backgrounds WHERE id = $1', [id]);
        if (!background.rows.length) {
            return res.status(404).json({ error: 'Background no encontrado' });
        }

        // 🔹 Extraer el ID público de Cloudinary
        const publicId = background.rows[0].image_url.split('/').pop().split('.')[0];

        // 🔹 Eliminar la imagen de Cloudinary
        await cloudinary.uploader.destroy(`backgrounds/${publicId}`);

        // 🔹 Eliminar el registro de la base de datos
        await pool.query('DELETE FROM backgrounds WHERE id = $1', [id]);

        res.json({ message: 'Background eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el background' });
    }
});


module.exports = router;
