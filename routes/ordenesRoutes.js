const express = require('express');
const router = express.Router();
const db = require('../config/database/db')
const authenticate = require('../middleware/authenticate');
const isAdmin = require('../middleware/isAdmin')

// Crear una orden
router.post('/', authenticate, async (req, res) => {
    try {
        const { usuario_id, productos, total } = req.body;
        
        if (!productos || productos.length === 0) {
            return res.status(400).json({ error: 'La orden debe contener productos.' });
        }

        // Insertar la orden
        const ordenResult = await db.query(
            'INSERT INTO ordenes (usuario_id, total, estado) VALUES ($1, $2, $3) RETURNING id',
            [usuario_id, total, 'pendiente']  // Asumiendo que el estado es 'pendiente'
        );
        const orden_id = ordenResult.rows[0].id;

        // Crear los valores para insertar los productos
        const ordenProductosValues = productos.flatMap(p => [orden_id, p.producto_id, p.cantidad, p.precio]);

        // Generar la consulta de inserción dinámica para los productos
        const ordenProductosQuery = `
            INSERT INTO ordenes_productos (orden_id, producto_id, cantidad, precio)
            VALUES
            ${productos.map((_, i) => `($${i * 4 + 1}, $${i * 4 + 2}, $${i * 4 + 3}, $${i * 4 + 4})`).join(', ')}
        `;

        // Ejecutar la consulta para insertar los productos
        await db.query(ordenProductosQuery, ordenProductosValues);

        res.status(201).json({ mensaje: 'Orden creada con éxito', orden_id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear la orden' });
    }
});


// Obtener todas las órdenes (solo admin)
router.get('/', authenticate, isAdmin, async (req, res) => {
    try {
        const ordenes = await db.query(
            'SELECT * FROM ordenes ORDER BY creado_en DESC'
        );
        res.json(ordenes.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener las órdenes' });
    }
});

// Obtener una orden por ID (solo admin)
router.get('/:id', authenticate, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const orden = await db.query(
            'SELECT * FROM ordenes WHERE id = $1',
            [id]
        );

        if (orden.rows.length === 0) {
            return res.status(404).json({ error: 'Orden no encontrada' });
        }

        const productos = await db.query(
            'SELECT op.producto_id, p.titulo, op.cantidad, op.precio FROM ordenes_productos op JOIN productos p ON op.producto_id = p.id WHERE op.orden_id = $1',
            [id]
        );

        res.json({ ...orden.rows[0], productos: productos.rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener la orden' });
    }
});

// Marcar orden como realizada
router.put('/:id/realizar', authenticate, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        await db.query(
            'UPDATE ordenes SET estado = $1 WHERE id = $2',
            ['realizado', id]
        );
        res.json({ mensaje: 'Orden marcada como realizada' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar la orden' });
    }
});

// Eliminar una orden por ID (solo admin)
router.delete('/:id', authenticate, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        // Primero eliminar los productos relacionados a la orden
        await db.query(
            'DELETE FROM ordenes_productos WHERE orden_id = $1',
            [id]
        );

        // Luego eliminar la orden
        const result = await db.query(
            'DELETE FROM ordenes WHERE id = $1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Orden no encontrada' });
        }

        res.json({ mensaje: 'Orden eliminada con éxito' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar la orden' });
    }
});


module.exports = router;
