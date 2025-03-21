const pool = require('../config/database/db.js'); // <- importamos la base de datos a 'pool' que es la que usaremos para trabajar con la bdd.
const bcrypt = require('bcryptjs'); // <- importamos bcrypt para encriptar los datos.

// Primera funcion. Crear usuario.
const createUser = async (nombre, email, password) => {
    try {    
        const emailLowerCase = email.toLowerCase(); // Convertimos el email a minúsculas

        const userExist = await pool.query('SELECT * FROM usuarios WHERE LOWER(email) = $1', [emailLowerCase]);
        if (userExist.rows.length > 0) {
            throw new Error("El email ya está registrado.");
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await pool.query(
            'INSERT INTO usuarios (nombre, email, password, rol, foto_perfil, creado_en) VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP) RETURNING *',
            [nombre, emailLowerCase, hashedPassword, 'usuario', 'user-icon.png']
        );

        return newUser.rows[0];
    } catch (error) {
        throw new Error(error.message);
    }
};

// Obtener un usuario por correo.
const getUserByEmail = async (email) => {
    try {
        const user = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
        return user.rows[0];
    } catch (error) {
        throw new Error('Error al obtener el usuario');
    }
};
//Obtener usuario por id.
const getUserById = async (id) => {
    try {
        // Consulta SQL para buscar al usuario por su ID
        const result = await pool.query('SELECT * FROM usuarios WHERE id = $1', [id]);

        // Retorna el primer usuario encontrado o null si no existe
        return result.rows[0] || null;
    } catch (error) {
        console.error('Error al obtener el usuario por ID:', error.message);
        throw new Error('Error en la base de datos al buscar el usuario');
    }
};

//Actualizar perfil de usuario.
const updateUserProfile = async ({ id, nombre, password, foto }) => {
    const result = await pool.query(
        `UPDATE usuarios 
         SET 
            nombre = COALESCE($1, nombre), 
            password = COALESCE($2, password), 
            foto_perfil = COALESCE($3, foto_perfil)
         WHERE id = $4 
         RETURNING id, nombre, email, foto_perfil, rol, creado_en`,
        [nombre, password, foto, id]
    );
    return result.rows[0]; // Retorna el usuario actualizado
};

// Exportamos la funcion para poder utilizarla en el controller
module.exports = {createUser, getUserByEmail, updateUserProfile, getUserById} // --------------> userController.js .......