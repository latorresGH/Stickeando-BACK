const pool = require('../config/database/db.js'); // <- importamos la base de datos a 'pool' que es la que usaremos para trabajar con la bdd.
const bcrypt = require('bcryptjs'); // <- importamos bcrypt para encriptar los datos.

// Primera funcion. Crear usuario.
const createUser = async (nombre, email, password) => {
    try {                       // pool.query es para hacer solicitudes a la base de datos
        const userExist = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]); //<- WHERE email = $1: La condición que estamos buscando. $1 es un marcador de posición (placeholders) que se usa para evitar inyecciones SQL. Se reemplaza con el valor que se pasa como parámetro en el arreglo [email]. Entonces, esta parte de la consulta está buscando un usuario cuyo campo email coincida con el valor de email que recibimos como parámetro.
        if (userExist.rows.length > 0) {// <- userExists es donde tenemos la consulta, rows seria el array donde estan los resultados de la consulta y si hay mas de 1 columna en el resultado es porque existe un email igual a ese por lo tanto ya existe.
            throw new Error("El email ya está registrado.")
        }

        const salt = await bcrypt.genSalt(10); //<- generamos el "salt" que vendria a ser un valor aleatorio para encriptarla y que jamas se repita una contraseña
        const hashedPassword = await bcrypt.hash(password, salt);  //<- hasheamos la contraseña combinando la contraseña con el salt.

        const newUser = await pool.query( //Generamos una query sql
            'INSERT INTO usuarios (nombre, email, password, rol, foto_perfil, creado_en) VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP) RETURNING *', //CURRENT_TIMESTAMP: Esta es una función de PostgreSQL que devuelve la fecha y hora actuales
            [nombre, email, hashedPassword, 'usuario', 'user-icon']                                                             //RETURNING *: Esta parte le dice a PostgreSQL que devuelva el registro completo (todos los campos) del nuevo usuario que se acaba de insertar. El * indica que queremos todos los campos de ese registro (como el id, nombre, correo, etc.). Esto es útil para obtener el usuario recién creado con todos los valores insertados, incluyendo el id que se generó automáticamente.
            // $1,   $2,        $3,         $4,          $5  <- por eso en values ponemos ($1, $2, $3, $4, $5, .....)
        );

        return newUser.rows[0]; // Retorna el usuario recien creado por eso se usa la columna [0]. devuelve el objeto del usuario recién creado al código que invocó la función
    }    
    catch (error) {
        throw new Error(error.message);
    }
}
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