const categoryModel = require('../models/categoryModel');

// Crear una categoría
const createCategory = async (req, res) => {
    const { nombre } = req.body;

    if (!nombre) {
        return res.status(400).json({ message: 'El nombre de la categoría es obligatorio' });
    }

    try {
        const category = await categoryModel.createCategory(nombre);
        res.status(201).json({ message: 'Categoría creada con éxito', category });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear la categoría', error: error.message });
    }
};

// Eliminar una categoría
const deleteCategory = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: 'El ID de la categoría es obligatorio' });
    }

    try {
        const category = await categoryModel.deleteCategory(id);
        if (!category) {
            return res.status(404).json({ message: 'Categoría no encontrada' });
        }
        res.status(200).json({ message: 'Categoría eliminada con éxito', category });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar la categoría', error: error.message });
    }
};

const getCategories = async (req, res) => {
    try {
        const categories = await categoryModel.getCategories();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las categorías', error: error.message });
    }
};


module.exports = { 
    createCategory, 
    deleteCategory,
    getCategories
};