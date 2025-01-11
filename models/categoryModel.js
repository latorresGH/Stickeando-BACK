const pool = require('../config/database/db.js'); // <- importamos la base de datos a 'pool' que es la que usaremos para trabajar con la bdd.

// Crear una categoría
const createCategory = () => {
    const query = ` INSERT INTO categorias (nombre) VALUES $1 RETURNING *; `; // <- Creamos la query que insertará una nueva categoría en la bdd.

    const values = ['nombre']; // <- Creamos un array con los valores que se insertarán en la bdd.

    try {
        const result = await.pool.query(query, values); // <- Ejecutamos la query y guardamos el resultado en 'result'.
        return result.rows[0]; // <- Retornamos la primera fila del resultado.
    } catch (error) {
        throw new Error('Error al crear la categoria: ' + error.message); // <- Si hay un error, lo lanzamos.
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