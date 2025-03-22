const pool = require("../config/database/db.js"); // <- importamos la base de datos a 'pool' que es la que usaremos para trabajar con la bdd.

const createProduct = async (titulo, precio, imageUrl, categoria_id) => {
  const result = await pool.query(
    "INSERT INTO productos (titulo, precio, imagen_url, categoria_id) VALUES ($1, $2, $3, $4) RETURNING *",
    [titulo, precio, imageUrl, categoria_id]
  );
  return result.rows[0]; // Retorna el producto creado
};

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
    return result.rows[0]; // Devolvemos el producto actualizado
  } catch (error) {
    throw new Error("Error al actualizar el producto: ERROR-M" + error.message);
  }
};

const deleteProduct = async (id) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN"); // Inicia una transacción

    // Eliminar referencias del producto en "carrito_productos"
    const deleteCarritoProductosQuery = `
                DELETE FROM carrito_productos
                WHERE producto_id = $1;
            `;
    await client.query(deleteCarritoProductosQuery, [id]);

    // Desvincular el producto de la categoría
    const updateQuery = `
                UPDATE productos
                SET categoria_id = NULL
                WHERE id = $1;
            `;
    await client.query(updateQuery, [id]);

    // Eliminar el producto
    const deleteQuery = `
                DELETE FROM productos
                WHERE id = $1;
            `;
    await client.query(deleteQuery, [id]);

    await client.query("COMMIT"); // Confirmar la transacción
    console.log("Producto eliminado correctamente");
  } catch (error) {
    await client.query("ROLLBACK"); // Si hay un error, deshace la transacción
    throw new Error("Error al eliminar el producto: ERROR-M" + error.message);
  } finally {
    client.release(); // Liberar el cliente
  }
};

const getProductById = async (id) => {
  const query = "SELECT * FROM productos WHERE id = $1";
  const values = [id];
  try {
    const result = await pool.query(query, values);
    return result.rows[0]; // Devuelve el producto si existe
  } catch (error) {
    throw new Error("Error al obtener el producto: ERROR-M" + error.message);
  }
};

const listProducts = async () => {
  const query = "SELECT * FROM productos";
  try {
    const result = await pool.query(query);
    return result.rows; // Devuelve todos los productos
  } catch (error) {
    throw new Error("Error al obtener los productos: " + error.message);
  }
};

const getAllProducts = async () => {
  const query = "SELECT * FROM productos";
  try {
    const result = await pool.query(query);
    return result.rows; // Devuelve todos los productos
  } catch (error) {
    throw new Error("Error al obtener todos los productos: " + error.message);
  }
};

const getProductsByCategoryAndSearch = async (categoryId, searchQuery) => {
  const query = `
            SELECT * FROM productos 
            WHERE ($1::int IS NULL OR categoria_id = $1)
            AND ($2::text IS NULL OR titulo ILIKE '%' || $2 || '%');
        `;
  const values = [categoryId || null, searchQuery || null];

  console.log("Query:", query); // Verifica la consulta
  console.log("Values:", values); // Verifica los valores de los parámetros

  try {
    const result = await pool.query(query, values);
    return result.rows;
  } catch (error) {
    console.error("Database query failed:", error); // Detalles del error en la consulta
    throw new Error("Error al obtener productos con filtros: " + error.message);
  }
};

module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById,
  listProducts,
  getProductsByCategoryAndSearch,
  getAllProducts,
};
