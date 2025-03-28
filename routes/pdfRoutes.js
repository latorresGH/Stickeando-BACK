const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pdfkit = require('pdfkit');
const router = express.Router();

// Configuración de almacenamiento para multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'pedidos/'); // Carpeta donde se guardarán los archivos
  },
  filename: (req, file, cb) => {
    const fileName = Date.now() + '.pdf'; // Usar .pdf explícitamente como extensión
    cb(null, fileName); // Guardar el archivo con el nombre generado
  }
});

// Configurar multer para manejar un solo archivo llamado 'file'
const upload = multer({ storage });

// Ruta para generar el PDF
router.post('/generarPDF', upload.single('file'), (req, res) => {
  try {
    // Acceder a los otros campos enviados
    const carrito = JSON.parse(req.body.carrito); // Los datos del carrito
    const usuario = JSON.parse(req.body.usuario); // Los datos del usuario
    const file = req.file; // El archivo subido estará en req.file

    console.log('Carrito:', carrito);
    console.log('Usuario:', usuario);
    console.log('Archivo recibido:', file);

    // Nombre del archivo generado (debe ser el mismo)
    const fileName = file.filename; // Usar el filename generado por multer
    const filePath = path.join(__dirname, 'pedidos', fileName);

    // Crear el archivo PDF
    const doc = new pdfkit();
    doc.pipe(fs.createWriteStream(filePath));


    // Primero, calculamos el precio total
    let total = 0; // Variable para el total
    carrito.forEach((item) => {
      total += item.precio * item.cantidad; // Calculando el total
    });

    // Aseguramos que el "Precio Total" se imprima en la primera línea
    doc.fontSize(14).text(`Precio Total: $${total}`, { align: 'left' });

    // Información del usuario
    doc.moveDown(1); // Añadimos un salto de línea después del precio total

    // Salto de línea para separar la información del carrito
    doc.moveDown(1);

    // Título para los productos
    doc.text('Productos comprados:', { align: 'left' });

    // Listado de productos
    carrito.forEach((item) => {
      const lineText = `${item.titulo} - $${item.precio} x ${item.cantidad}`;
      doc.text(lineText, { continued: true }).text(` $${item.precio * item.cantidad}`);
    });

    // Finaliza el documento
    doc.end();

    // Enviar respuesta de éxito con el nombre de archivo correcto
    res.status(200).json({
      message: 'PDF generado exitosamente',
      filePath: `https://stickeando.onrender.com/pedidos/${fileName}`, // Usar el nombre de archivo generado por multer
    });
  } catch (error) {
    console.error('Error generando PDF:', error);
    res.status(500).json({ error: 'Error generando PDF' });
  }
});



module.exports = router;
