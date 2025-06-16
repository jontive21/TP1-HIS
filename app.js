const express = require('express');
const app = express();
const path = require('path');

// Configuración básica
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Middleware para datos en POST
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Rutas - Aquí debes conectar tus archivos .routes.js
const admisionRoutes = require('./routes/admision.routes');
const pacienteRoutes = require('./routes/paciente.routes');
const camaRoutes = require('./routes/cama.routes');
const habitacionRoutes = require('./routes/habitacion.routes');
const signosVitalesRoutes = require('./routes/signos_vitales.routes');
const altaRoutes = require('./routes/alta.routes');
const cancelacionRoutes = require('./routes/cancelacion.routes');
const enfermeriaRoutes = require('./routes/enfermeria.routes');
const evaluacionMedicaRoutes = require('./routes/evaluaciones_medicas.routes');
const estudioRoutes = require('./routes/estudio.routes');

// Usar las rutas
app.use('/admisiones', admisionRoutes);
app.use('/pacientes', pacienteRoutes);
app.use('/camas', camaRoutes);
app.use('/habitaciones', habitacionRoutes);
app.use('/signos_vitales', signosVitalesRoutes);
app.use('/altas', altaRoutes);
app.use('/cancelaciones_admision', cancelacionRoutes);
app.use('/enfermeria', enfermeriaRoutes);
app.use('/evaluaciones_medicas', evaluacionMedicaRoutes);
app.use('/estudios', estudioRoutes);

// Ruta raíz (dashboard)
app.get('/', (req, res) => {
  res.redirect('/'); // Esto es un ejemplo – deberías usar tu dashboard
});

// Opcional: si usas un archivo index.routes.js
// const indexRoutes = require('./routes/index.routes');
// app.use('/', indexRoutes);

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});