const productModel = require('../models/productModel');

//Crear producto
const createProduct = async (req, res) => {
    const { titulo, precio, categoria_id} = req.body;
    const imagen_url = req.file ? `${req.file.filename}` : null;

    // Validar que los campos no estén vacíos
    if (!titulo || !precio || !categoria_id || !imagen_url) {
        return res.status(400).json({message: 'Todos los campos son obligatorios'});
    }

    if (isNaN(categoria_id)) {
        return res.status(400).json({ message: "El campo categoria_id debe ser un número válido" });
    }

    // console.log({ titulo, precio, categoria_id, imagen_url });

    // Crear el producto
    try {
        const product = await productModel.createProduct(titulo, precio, categoria_id,imagen_url);
        res.status(200).json({ meesage: 'Producto creado con exito', product });
    } catch (error) {
        res.status(500).json({ message: 'Ocurrió un error al crear el producto, ERROR-C: ', error: error.message });
    }
}

const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { titulo, precio, categoria_id } = req.body;
    const imagen_url = req.file ? `/imagenProducto/${req.file.filename}` : null;
    const productExists = await productModel.getProductById(id);

    if (!productExists) {
        return res.status(404).json({ message: 'Producto no encontrado ERROR-C' });
    }

    // Validar que los campos no estén vacíos
    if (!titulo || !precio || !categoria_id) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios ERROR-C' });
    }

    if (isNaN(categoria_id)) {
        return res.status(400).json({ message: "El campo categoria_id debe ser un número válido ERROR-C" });
    }

    try {
        // Llamamos al modelo para actualizar el producto
        const updatedProduct = await productModel.updateProduct(id, titulo, precio, categoria_id, imagen_url);
        res.status(200).json({ message: 'Producto actualizado con éxito', updatedProduct });
    } catch (error) {
        res.status(500).json({ message: 'Ocurrió un error al actualizar el producto ERROR-C', error: error.message });
    }
}

// Eliminar producto
const deleteProduct = async (req, res) => {
    const { id } = req.params;
    const productExists = await productModel.getProductById(id);

    if (!productExists) {
        return res.status(404).json({ message: 'Producto no encontrado' });
    }

    try {
        // Llamamos al modelo para eliminar el producto
        await productModel.deleteProduct(id);
        res.status(200).json({ message: 'Producto eliminado con éxito' });
    } catch (error) {
        res.status(500).json({ message: 'Ocurrió un error al eliminar el producto ERROR-C', error: error.message });
    }
}

const listProducts = async (req, res) => {
    try {
        const products = await productModel.listProducts();
        res.status(200).json({ products });
    } catch (error) {
        res.status(500).json({ message: 'Ocurrió un error al obtener los productos', error: error.message });
    }
}

const getProductsByCategoryAndSearch = async (req, res) => {
    const { categoryId, searchQuery } = req.query;

    try {
        const products = await productModel.getProductsByCategoryAndSearch(categoryId, searchQuery);
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener productos', error: error.message });
    }
};

const getProducts = async (req, res) => {
    const { category, search } = req.query;

    try {
        let products;
        if (category || search) {
            // Si hay filtros, usa `getProductsByCategoryAndSearch`
            products = await productModel.getProductsByCategoryAndSearch(category, search);
        } else {
            // Si no hay filtros, usa `getAllProducts`
            products = await productModel.getAllProducts();
        }
        res.json({ products });
    } catch (error) {
        console.error(error); // Loguea el error para depuración
        res.status(500).json({ error: error.message });
    }
};

const getProductController = async (req, res) => {
    const { id } = req.params;
    try {
        const producto = await productModel.getProductById(id);
        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json(producto);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { 
    createProduct,
    updateProduct,
    deleteProduct,
    listProducts,
    getProductsByCategoryAndSearch,
    getProducts,
    getProductController
 }