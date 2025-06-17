
const express = require("express");
const path = require("path");
const mysql = require("mysql2/promise");
const app = express();


app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Rutas con prefijo (la ruta se completa en este archivo)
const admisionRoutes = require('./routes/admision.routes');
const pacienteRoutes = require('./routes/paciente.routes');
const camaRoutes = require('./routes/cama.routes');
const dashboardRoutes = require('./routes/dashboard');
const medicoRoutes = require('./routes/medico'); // Nuevo
const logoutRoutes = require('./routes/logout'); // Nuevo

// Rutas sin prefijo (la ruta completa está definida dentro del archivo)
const altaRoutes = require('./routes/alta.routes');
const authRoutes = require('./routes/auth');
const cancelacionRoutes = require('./routes/cancelacion.routes');
const enfermeriaRoutes = require('./routes/enfermeria.routes');
const estudioRoutes = require('./routes/estudio.routes');
const evaluacionesMedicasRoutes = require('./routes/evaluaciones_medicas.routes');
const habitacionRoutes = require('./routes/habitacion.routes');
const medicamentoRoutes = require('./routes/medicamento.routes'); // Nuevo
const signosVitalesRoutes = require('./routes/signos_vitales.routes'); // Nuevo
const usuarioRoutes = require('./routes/usuario.routes'); // Nuevo
//const indexRoutes = require('./routes/index'); // El router que está en tu index.js


app.use('/admisiones', admisionRoutes);   // Rutas: /admisiones, /admisiones/nueva
app.use('/pacientes', pacienteRoutes);   // Rutas: /pacientes, /pacientes/:id
app.use('/camas', camaRoutes);           // Ruta: /camas
app.use('/dashboard', dashboardRoutes);   // Ruta: /dashboard
app.use('/medicos', medicoRoutes);       // Ruta: /medicos (Nuevo)
app.use('/logout', logoutRoutes);         // Ruta: /logout (Nuevo)


// B) RUTAS REGISTRADAS EN LA RAÍZ:
// Para estos archivos, la ruta ya está completa dentro del propio fichero.
// Los registramos en la raíz de la aplicación ('/').
app.use('/', altaRoutes);                  // Ruta: /altas
app.use('/', cancelacionRoutes);          // Ruta: /cancelaciones_admision
app.use('/', enfermeriaRoutes);           // Ruta: /evaluaciones_enfermeria
app.use('/', estudioRoutes);              // Ruta: /estudios
app.use('/', evaluacionesMedicasRoutes);  // Ruta: /evaluaciones_medicas
app.use('/', habitacionRoutes);           // Ruta: /habitaciones
app.use('/', medicamentoRoutes);         // Ruta: /medicamentos (Nuevo)
app.use('/', signosVitalesRoutes);      // Ruta: /signos_vitales (Nuevo)
app.use('/', usuarioRoutes);              // Ruta: /usuarios (Nuevo)


// C) RUTAS DE AUTENTICACIÓN Y PRINCIPAL:
// Estas también se registran en la raíz según tus archivos.
app.use('/', authRoutes);                 // Rutas: /, /login (POST)
//app.use('/', indexRoutes);                // Rutas: /, /dashboard (con redirección)



app.listen(process.env.PORT || 3001, () => {
    console.log(`Servidor funcionando en http://localhost:${process.env.PORT || 3001}`);
});

module.exports = app;