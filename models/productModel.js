const pool = require('../config/database/db.js'); // <- importamos la base de datos a 'pool' que es la que usaremos para trabajar con la bdd.

    //Crear un nuevo producto
    const createProduct = async (titulo, precio, categoria_id, imagen_url) => {
        const query = `
            INSERT INTO productos (titulo, precio, categoria_id, imagen_url)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;
        const values = [titulo, precio, categoria_id, imagen_url];
        
        try {
            const result = await pool.query(query, values);
            return result.rows[0];  // Devolvemos el primer (y único) registro creado
        } catch (error) {
            throw new Error('Error al crear el producto: ERROR-M' + error.message);
        }
    }

    const updateProduct = async (id, titulo, precio, categoria_id, imagen_url) => {
        const query = `
            UPDATE productos
            SET titulo = $1, precio = $2, categoria_id = $3, imagen_url = $4
            WHERE id = $5
            RETURNING *;
        `;
        const values = [titulo, precio, categoria_id, imagen_url, id];
    
        try {
            const result = await pool.query(query, values);
            return result.rows[0];  // Devolvemos el producto actualizado
        } catch (error) {
            throw new Error('Error al actualizar el producto: ERROR-M' + error.message);
        }
    }

    // Eliminar un producto de la base de datos
    const deleteProduct = async (id) => {
        const query = `
            DELETE FROM productos
            WHERE id = $1;
        `;
        const values = [id];

        try {
            await pool.query(query, values);
        } catch (error) {
            throw new Error('Error al eliminar el producto: ERROR-M' + error.message);
        }
    }

    const getProductById = async (id) => {
        const query = 'SELECT * FROM productos WHERE id = $1';
        const values = [id];
        try {
            const result = await pool.query(query, values);
            return result.rows[0]; // Devuelve el producto si existe
        } catch (error) {
            throw new Error('Error al obtener el producto: ERROR-M' + error.message);
        }
    }

    const listProducts = async () => {
        const query = 'SELECT * FROM productos';
        try {
            const result = await pool.query(query);
            return result.rows; // Devuelve todos los productos
        } catch (error) {
            throw new Error('Error al obtener los productos: ' + error.message);
        }
    }

    const getAllProducts = async () => {
        const query = 'SELECT * FROM productos';
        try {
            const result = await pool.query(query);
            return result.rows; // Devuelve todos los productos
        } catch (error) {
            throw new Error('Error al obtener todos los productos: ' + error.message);
        }
    }
    
    const getProductsByCategoryAndSearch = async (categoryId, searchQuery) => {
        const query = `
            SELECT * FROM productos 
            WHERE ($1::int IS NULL OR categoria_id = $1)
            AND ($2::text IS NULL OR titulo ILIKE '%' || $2 || '%');
        `;
        const values = [categoryId || null, searchQuery || null];

        console.log('Query:', query); // Verifica la consulta
        console.log('Values:', values); // Verifica los valores de los parámetros
    
        try {
            const result = await pool.query(query, values);
            return result.rows;
        } catch (error) {
            console.error('Database query failed:', error); // Detalles del error en la consulta
            throw new Error('Error al obtener productos con filtros: ' + error.message);
        }
    }
    
    

module.exports = { 
    createProduct,
    updateProduct,
    deleteProduct,
    getProductById,
    listProducts,
    getProductsByCategoryAndSearch,
    getAllProducts,
 }