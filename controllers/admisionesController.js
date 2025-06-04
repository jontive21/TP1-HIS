const Admision = require('../models/Admision');
const Paciente = require('../models/Paciente');
const { pool } = require('../config/db');

// Mostrar formulario para nueva admisión
exports.showNuevaAdmision = async (req, res) => {
    try {
        const [pacientes] = await pool.query(
            `SELECT * FROM pacientes WHERE activo = TRUE ORDER BY apellido, nombre`
        );
        const camas = await Admision.getCamasDisponibles();
        res.render('admisiones/new', {
            title: 'Nueva Admisión',
            pacientes,
            camas
        });
    } catch (error) {
        console.error(error);
        res.status(500).render('error/500', { title: 'Error interno del servidor' });
    }
};

// Procesar nueva admisión
exports.processAdmision = async (req, res) => {
    const data = req.body;
    const camaDisponible = await Admision.validateCamaAsignacion(data.cama_id);
    if (!camaDisponible) {
        return res.render('admisiones/new', {
            title: 'Nueva Admisión',
            error: 'La cama seleccionada no está disponible.',
            pacientes: (await require('../config/db').query(
                `SELECT * FROM pacientes WHERE activo = TRUE ORDER BY apellido, nombre`
            ))[0],
            camas: await Admision.getCamasDisponibles(),
            admision: data
        });
    }
    await Admision.createAdmision(data);
    res.redirect('/admisiones');
};

// Cancelar admisión (soft delete y liberar cama)
exports.cancelarAdmision = async (req, res) => {
    const id = req.params.id;
    const [rows] = await pool.query(
        `SELECT cama_id FROM admisiones WHERE id = ? AND estado = 'activa'`, [id]
    );
    if (!rows.length) {
        return res.status(404).render('error/404', { title: 'Admisión no encontrada' });
    }
    const cama_id = rows[0].cama_id;
    await require('../config/db').query(
        `UPDATE admisiones SET estado = 'cancelada' WHERE id = ?`, [id]
    );
    await require('../config/db').query(
        `UPDATE camas SET estado = 'libre' WHERE id = ?`, [cama_id]
    );
    res.redirect('/admisiones');
};

// Mostrar detalle de admisión
exports.showDetalleAdmision = async (req, res) => {
    const id = req.params.id;
    const [rows] = await pool.query(
        `SELECT a.*, 
                p.nombre AS paciente_nombre, p.apellido AS paciente_apellido, 
                c.numero AS cama_numero, h.numero AS habitacion_numero
         FROM admisiones a
         JOIN pacientes p ON a.paciente_id = p.id
         JOIN camas c ON a.cama_id = c.id
         JOIN habitaciones h ON c.habitacion_id = h.id
         WHERE a.id = ?`, [id]
    );
    if (!rows.length) {
        return res.status(404).render('error/404', { title: 'Admisión no encontrada' });
    }
    res.render('admisiones/detalle', { 
        title: 'Detalle de Admisión', 
        admision: rows[0] 
    });
};


