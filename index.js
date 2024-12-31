const express = require('express'); //<-- Solicitamos la dependencia express. (para menajera rutas y la logica del server)
const dotenv = require('dotenv'); // <-- Solicitamos la dependencia dotenv. (para manejar las variables de entorno .env)
const pool = require('./config/database/db'); // Importar la conexión a la base de datos que creamos el archivo db.js
const path = require('path'); // <-- Solicitamos la dependencia path. (para manejar rutas de archivos)
const cors = require('cors'); // ¿Qué hace CORS? Por defecto, los navegadores bloquean las solicitudes de recursos entre dominios diferentes por razones de seguridad. Si tu frontend está ejecutándose en un dominio distinto al de tu backend, necesitas habilitar CORS en tu servidor para permitir que esas solicitudes entre el frontend y el backend sean procesadas correctamente.
const userRoutes = require('./routes/userRoutes');
const productoRoutes = require("./routes/productoRoutes"); // <-- Solicitamos las rutas de productos. (para manejar las rutas de productos)
const categoryRoutes = require('./routes/categoryRoutes'); // Importar las rutas de categorías
const carritoRoutes = require('./routes/carritoRoutes'); // Importar las rutas de carritos
const carritoProductos = require('./routes/carritoProductosRoutes'); // Importar las rutas de carritoProductos
const ordenesRoutes = require('./routes/ordenesRoutes'); // Importar las rutas de ordenes
const authenticateRoutes = require('./routes/authenticateRoutes'); // Importar el middleware de autenticación
const imgprofileRoutes = require('./routes/imgprofileRoutes'); // Importar las rutas de imágenes de perfil
//Configuraciones de la variable de entorno env.
dotenv.config();

//Utilizamos express() para inicializarlo, mas tarde utilizaremos la constante "app" para configurar rutas, middlewares entre otras.
const app = express();

const PORT = process.env.PORT || 3000; //<--- En la variable PORT guardamos el puerto que vamos a utilziar 
// (usamos process.env.PORT para que utilice el puerto que esta definido en las variables de entorno).
// En caso de que no exista tal variable de entorno se utilizara el puerto 3000.
//Middleware para parsear el JSON.
app.use(express.json()); //<--- para leer/analizar el cuerpo o los datos en formato JSON, y asi JavaScript poder leerlos.
//Creacion de carpeta.
app.use('/imagenProducto', express.static(path.join(__dirname, 'imagenProducto')));
app.use(cors()); // Habilitar CORS

// Rutas
app.use('/api/productos', productoRoutes); // Rutas de productos
app.use('/api/users', userRoutes); // Rutas de usuarios
app.use('/api/categorias', categoryRoutes); // Rutas de categorias
app.use('/api/carritos', carritoRoutes); // Rutas de carritos
app.use('/api/carritoProductos', carritoProductos); // Rutas de carritoProductos
app.use('/api/ordenes', ordenesRoutes); // Rutas de ordenes
app.use('/api', authenticateRoutes); // Rutas de autenticación
app.use('/api', imgprofileRoutes); // Rutas de imágenes de perfil
//Levantar servidor
app.listen(PORT, () => {  // <-- usamos un listen para escuchar/accionar recibiendo el puerto(PORT) y retornamos un console.log con los datos donde se este ejecutando.
    console.log(`El backend esta corriendo en la URL http://localhost:${PORT}`)
})

console.log('JWT_SECRET:', process.env.JWT_SECRET);
