const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userModel = require('../models/userModel'); // <-- importamos el modelo de usuario para trabjaar con el.
const carritoModel = require('../models/carritoModel'); // Asegúrate de que esta ruta sea correcta según tu estructura de archivos

// userController.js
const registerUser = async (req, res) => {
    const { nombre, email, password, productosCarrito } = req.body;

    // Validaciones
    if (!nombre) {
        return res.status(400).json({ message: 'Ingrese un nombre' });
    } else if (!email) {
        return res.status(400).json({ message: 'Ingrese un correo electrónico' });
    } else if (!password) {
        return res.status(400).json({ message: 'Ingrese una contraseña' });
    }

    try {
        // Crear el usuario
        const newUser = await userModel.createUser(nombre, email, password);

        // Crear el carrito asociado al usuario
        const carrito = await carritoModel.createCarrito(newUser.id);

        // Si el usuario tiene productos en el carrito de sesión, agregar al carrito
        if (productosCarrito && productosCarrito.length > 0) {
            await carritoModel.addProductosAlCarrito(carrito.id, productosCarrito);
        }

        res.status(200).json({
            message: 'Usuario creado exitosamente',
            user: newUser,
            carrito: carrito
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'No se pudo crear el usuario. ERROR-C: ' + err.message });
    }
};


const loginUser = async (req, res) => {
    const { email, password } = req.body;

    // Validación básica
    if (!email || !password) {
        return res.status(400).json({ message: 'Correo y contraseña son obligatorios' });
    }

    try {
        const usuario = await userModel.getUserByEmail(email); // <-- obtenemos el correo con la función del modelo
        if (!usuario) {
            return res.status(400).json({ message: 'Correo inexistente o equivocado' });
        }

        const contrasenaCorrecta = await bcrypt.compare(password, usuario.password);
        if (!contrasenaCorrecta) {
            return res.status(400).json({ message: 'Contraseña incorrecta. Recuerda que es entre 6 y 16 caracteres.' })
        }

         // Crear el token JWT, se genera el token con el jwt.sign utilizando el id de usuario y el correo, despues utiliza el .env con la firma para verificar el token.
         const token = jwt.sign({ id: usuario.id, email: usuario.email, rol:usuario.rol }, process.env.JWT_SECRET, {
            expiresIn: '1h', // para que expire despues de 1 hora de sesión.
        });
        res.json({ message: 'Inicio de sesion exitoso', token });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Hubo un problema al iniciar sesión. ERROR-C: '+ err.message });
    }
}

const updateUserProfile = async (req, res) => {
    const { id, nombre, password, confirmPassword, foto } = req.body;

    if (!id) {
        return res.status(400).json({ message: 'El ID es obligatorio' });
    }

    try {
        const user = await userModel.getUserById(id);
        if (!user) {
            return res.status(400).json({ message: 'Usuario no encontrado' });
        }

        // Validación de contraseñas (si se incluyen)
        if (password && confirmPassword && password !== confirmPassword) {
            return res.status(400).json({ message: 'Las contraseñas no son iguales.' });
        }

        if (password && (password.length < 6 || password.length > 16)) {
            return res.status(400).json({ message: 'La contraseña debe tener entre 6 y 16 caracteres.' });
        }

        // Cifrado de la contraseña si fue proporcionada
        let hashedPassword = null;
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }

        // Construir los datos a actualizar, solo con los que fueron enviados
        const updatedUser = await userModel.updateUserProfile({
            id,
            nombre: nombre || user.nombre, // Si no se envía "nombre", se mantiene el actual
            password: hashedPassword || user.password, // Si no hay cambio de contraseña, se mantiene la actual
            foto: foto || user.foto_perfil, // Si no se envía "foto", se mantiene la actual
        });

        res.json({ message: 'Perfil actualizado exitosamente', user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el perfil', error: error.message });
    }
};



module.exports = {registerUser, loginUser, updateUserProfile}; // -----------------> Exportamos para userRoutes.js