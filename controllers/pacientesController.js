const Paciente = require('../models/Paciente');

// Mostrar lista paginada de pacientes
exports.showPacientes = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';

    let pacientes = [];
    if (search) {
        pacientes = await Paciente.searchPacientes(search);
    } else {
        const [rows] = await require('../config/db').query(
            `SELECT * FROM pacientes WHERE activo = TRUE ORDER BY apellido, nombre LIMIT ? OFFSET ?`,
            [limit, offset]
        );
        pacientes = rows;
    }

    res.render('pacientes/index', {
        title: 'Pacientes',
        pacientes,
        page,
        search
    });
};

// Mostrar formulario para nuevo paciente
exports.showNewPaciente = (req, res) => {
    res.render('pacientes/new', { title: 'Nuevo Paciente' });
};

// Procesar creación de paciente
exports.createPaciente = async (req, res) => {
    const data = req.body;
    const dniExists = await Paciente.validateDNI(data.dni);
    if (dniExists) {
        return res.render('pacientes/new', { 
            title: 'Nuevo Paciente', 
            error: 'El DNI ya está registrado.', 
            paciente: data 
        });
    }
    await Paciente.createPaciente(data);
    res.redirect('/pacientes');
};

// Mostrar formulario de edición
exports.showEditPaciente = async (req, res) => {
    const id = req.params.id;
    const [rows] = await require('../config/db').query(
        `SELECT * FROM pacientes WHERE id = ? AND activo = TRUE`, [id]
    );
    if (!rows.length) {
        return res.status(404).render('error/404', { title: 'Paciente no encontrado' });
    }
    res.render('pacientes/edit', { title: 'Editar Paciente', paciente: rows[0] });
};

// Procesar actualización de paciente
exports.updatePaciente = async (req, res) => {
    const id = req.params.id;
    const data = req.body;
    await Paciente.updatePaciente(id, data);
    res.redirect('/pacientes');
};