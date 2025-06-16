// app.js

const express = require('express');
const path = require('path');
const app = express();

// Configuración de vistas
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Middleware para formularios y archivos estáticos
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Importar rutas
const admisionRoutes = require('./routes/admision.routes');
const pacienteRoutes = require('./routes/paciente.routes');
const camaRoutes = require('./routes/cama.routes');
const habitacionRoutes = require('./routes/habitacion.routes');
const signosVitalesRoutes = require('./routes/signos_vitales.routes');
const altaRoutes = require('./routes/alta.routes');
const cancelacionRoutes = require('./routes/cancelacion.routes');
const enfermeriaRoutes = require('./routes/enfermeria.routes');
const evaluacionesMedicasRoutes = require('./routes/evaluaciones_medicas.routes');
const estudioRoutes = require('./routes/estudio.routes');

// Usar rutas
app.use('/admisiones', admisionRoutes);
app.use('/pacientes', pacienteRoutes);
app.use('/camas', camaRoutes);
app.use('/habitaciones', habitacionRoutes);
app.use('/signos_vitales', signosVitalesRoutes);
app.use('/altas', altaRoutes);
app.use('/cancelaciones', cancelacionRoutes);
app.use('/enfermeria', enfermeriaRoutes);
app.use('/medicas', evaluacionesMedicasRoutes);
app.use('/estudios', estudioRoutes);

// Ruta raíz - Dashboard
app.get('/', (req, res) => {
  res.render('index'); // Esta línea debe coincidir con tu vista views/index.pug
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});