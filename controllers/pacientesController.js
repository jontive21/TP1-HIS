const Paciente = require('../models/Paciente');
const { pool } = require('../config/db'); // Agrega esta línea al inicio si no está

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

/**
 * Eliminar paciente (baja lógica)
 * FUNCIÓN FALTANTE CRÍTICA
 */
exports.deletePaciente = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Verificar si el paciente tiene admisiones activas
        const [admisionesActivas] = await pool.execute(
            'SELECT COUNT(*) as count FROM admisiones WHERE paciente_id = ? AND estado = "activa"',
            [id]
        );
        
        if (admisionesActivas[0].count > 0) {
            req.session.error = 'No se puede eliminar: el paciente tiene admisiones activas';
            return res.redirect('/pacientes');
        }
        
        // Baja lógica del paciente
        await pool.execute(
            'UPDATE pacientes SET activo = FALSE WHERE id = ?',
            [id]
        );
        
        req.session.success = 'Paciente eliminado correctamente';
        res.redirect('/pacientes');
        
    } catch (error) {
        console.error('Error al eliminar paciente:', error);
        req.session.error = 'Error al eliminar paciente';
        res.redirect('/pacientes');
    }
};

// Crear o actualizar paciente por DNI
exports.crearPaciente = async (req, res) => {
    try {
        const { dni } = req.body;

        // Verificar si paciente ya existe
        const [pacientes] = await pool.query('SELECT * FROM pacientes WHERE dni = ?', [dni]);

        if (pacientes.length > 0) {
            // Actualizar existente
            await pool.query(
                `UPDATE pacientes SET nombre = ?, apellido = ?, telefono = ?, sexo = ?, fecha_nacimiento = ?, direccion = ?, email = ?, 
                alergias = ?, medicamentos_actuales = ?, antecedentes_familiares = ?, presion_arterial = ?, frecuencia_cardiaca = ?, temperatura = ?
                WHERE dni = ?`,
                [
                    req.body.nombre, req.body.apellido, req.body.telefono, req.body.sexo, req.body.fecha_nacimiento, req.body.direccion, req.body.email,
                    req.body.alergias, req.body.medicamentos_actuales, req.body.antecedentes_familiares, req.body.presion_arterial, req.body.frecuencia_cardiaca, req.body.temperatura,
                    dni
                ]
            );
            req.session.success = 'Paciente actualizado correctamente';
            // Redirige al detalle del paciente actualizado
            const pacienteId = pacientes[0].id;
            return res.redirect(`/pacientes/${pacienteId}`);
        } else {
            // Crear nuevo
            const pacienteId = await Paciente.createPaciente(req.body);
            req.session.success = 'Paciente creado correctamente';
            // Redirige al detalle del paciente creado
            return res.redirect(`/pacientes/${pacienteId}`);
        }
    } catch (error) {
        console.error('Error al crear/actualizar paciente:', error);
        req.session.error = 'Error al crear o actualizar paciente';
        res.redirect('/pacientes/crear');
    }
};

exports.showEvaluacion = async (req, res) => {
    const { id } = req.params;
    const [pacientes] = await pool.query('SELECT * FROM pacientes WHERE id = ?', [id]);
    if (!pacientes.length) {
        req.session.error = 'Paciente no encontrado';
        return res.redirect('/pacientes');
    }
    res.render('pacientes/evaluacion', { paciente: pacientes[0] });
};

exports.guardarEvaluacion = async (req, res) => {
    const { id } = req.params;
    const { alergias, presion_arterial, frecuencia_cardiaca } = req.body;
    try {
        await pool.query(
            `UPDATE pacientes SET alergias = ?, presion_arterial = ?, frecuencia_cardiaca = ? WHERE id = ?`,
            [alergias, presion_arterial, frecuencia_cardiaca, id]
        );
        req.session.success = 'Evaluación guardada correctamente';
        res.redirect(`/pacientes/${id}`);
    } catch (error) {
        req.session.error = 'Error al guardar la evaluación';
        res.redirect(`/pacientes/${id}`);
    }
};

exports.detallePaciente = async (req, res) => {
    const { id } = req.params;
    const [pacientes] = await pool.query('SELECT * FROM pacientes WHERE id = ?', [id]);
    if (!pacientes.length) {
        req.session.error = 'Paciente no encontrado';
        return res.redirect('/pacientes');
    }
    // Pasa los mensajes y luego bórralos para que no se repitan
    const success = req.session.success;
    const error = req.session.error;
    delete req.session.success;
    delete req.session.error;
    res.render('pacientes/detalle', { paciente: pacientes[0], success, error });
};