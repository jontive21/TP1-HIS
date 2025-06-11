// routes/pacientes.js
const express = require('express');
const router = express.Router();
const Paciente = require('../models/Paciente');
const pacientesController = require('../controllers/pacientesController'); // <-- Agrega esta línea

// Middleware para verificar autenticación
const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return next();
    }
    res.redirect('/auth/login');
};

// Aplicar middleware a todas las rutas
router.use(isAuthenticated);

// Listar pacientes
router.get('/', async (req, res) => {
    try {
        const pacientes = await Paciente.searchPacientes('');
        res.render('pacientes/index', { 
            title: 'Pacientes', 
            pacientes 
        });
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { 
            message: 'Error al obtener pacientes' 
        });
    }
});

// Formulario para crear paciente
router.get('/create', (req, res) => {
    res.render('pacientes/create', { 
        title: 'Nuevo Paciente' 
    });
});

// Guardar nuevo paciente
router.post('/', async (req, res) => {
    try {
        const { nombre, apellido, dni, fecha_nacimiento, sexo, telefono, direccion, email } = req.body;
        
        // Validaciones básicas
        if (!nombre || !apellido || !dni || !fecha_nacimiento || !sexo) {
            return res.render('pacientes/create', { 
                title: 'Nuevo Paciente',
                error: 'Todos los campos marcados con * son obligatorios',
                paciente: req.body
            });
        }
        
        // Verificar si el DNI ya existe
        const dniExists = await Paciente.validateDNI(dni);
        if (dniExists) {
            return res.render('pacientes/create', { 
                title: 'Nuevo Paciente',
                error: 'El DNI ya está registrado',
                paciente: req.body
            });
        }
        
        // Crear paciente
        await Paciente.createPaciente({
            nombre, apellido, dni, fecha_nacimiento, sexo, telefono, direccion, email
        });
        
        req.session.success = 'Paciente creado correctamente';
        res.redirect('/pacientes');
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { 
            message: 'Error al crear paciente' 
        });
    }
});

// Ver detalles de paciente
router.get('/:id', async (req, res) => {
    try {
        const paciente = await Paciente.findById(req.params.id);
        if (!paciente) {
            return res.redirect('/pacientes');
        }
        res.render('pacientes/show', { 
            title: 'Detalles del Paciente', 
            paciente 
        });
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { 
            message: 'Error al obtener detalles del paciente' 
        });
    }
});

// Buscar pacientes
router.get('/search', async (req, res) => {
    try {
        const searchTerm = req.query.q || '';
        const pacientes = await Paciente.searchPacientes(searchTerm);
        res.render('pacientes/index', { 
            title: 'Resultados de búsqueda', 
            pacientes, 
            searchTerm 
        });
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { 
            message: 'Error en la búsqueda' 
        });
    }
});

// Eliminar paciente (baja lógica)
router.post('/:id/delete', pacientesController.deletePaciente); // <-- Agrega esta línea

router.get('/', (req, res) => {
    res.render('pacientes/index'); 
});

module.exports = router;