const pool = require('../config/database/db.js'); // <- importamos la base de datos a 'pool' que es la que usaremos para trabajar con la bdd.

// Crear una categoría
const createCategory = async (nombre) => { // Asegúrate de que la función sea async
    const query = `INSERT INTO categorias (nombre) VALUES ($1) RETURNING *;`; // <- Consulta SQL para insertar la categoría

    const values = [nombre]; // <- Pasamos la variable nombre al array de valores

    try {
        const result = await pool.query(query, values); // <- Usamos await para esperar el resultado de la query
        return result.rows[0]; // <- Retornamos la categoría insertada
    } catch (error) {
        throw new Error('Error al crear la categoria: ' + error.message); // <- Si ocurre un error, lo lanzamos
    }
};

// Eliminar una categoría
const deleteCategory = async (id) => {
    const query = `
        DELETE FROM categorias
        WHERE id = $1
        RETURNING *;
    `;
    const values = [id];

    try {
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        throw new Error('Error al eliminar la categoría: ' + error.message);
    }
};

const getCategories = async () => {
    const query = `SELECT * FROM categorias;`;

    try {
        const result = await pool.query(query);
        return result.rows;
    } catch (error) {
        throw new Error('Error al obtener las categorías: ' + error.message);
    }
};


module.exports = {
    createCategory,
    deleteCategory,
    getCategories 
}