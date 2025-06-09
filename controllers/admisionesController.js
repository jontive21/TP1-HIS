const Admision = require('../models/Admisiones');
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

/**
 * Procesar nueva admisión con VALIDACIONES CRÍTICAS
 */
exports.processAdmision = async (req, res) => {
    try {
        const { paciente_id, cama_id, tipo_admision, medico_referente, diagnostico_inicial } = req.body;
        
        // 1. VALIDACIÓN CRÍTICA: Verificar que la cama esté libre
        const [camaInfo] = await pool.execute(`
            SELECT c.*, h.capacidad, h.numero as habitacion_numero
            FROM camas c 
            JOIN habitaciones h ON c.habitacion_id = h.id 
            WHERE c.id = ?
        `, [cama_id]);
        
        if (!camaInfo[0] || camaInfo[0].estado !== 'libre') {
            const [pacientes] = await pool.execute('SELECT * FROM pacientes WHERE activo = TRUE');
            const camas = await Admision.getCamasDisponibles();
            return res.render('admisiones/new', {
                title: 'Nueva Admisión',
                pacientes,
                camas,
                error: 'La cama seleccionada no está disponible'
            });
        }
        
        // 2. VALIDACIÓN CRÍTICA: Regla de género en habitaciones compartidas
        const cama = camaInfo[0];
        if (cama.capacidad === 2) {
            // Verificar si hay otra cama ocupada en la habitación
            const [otrasCamas] = await pool.execute(`
                SELECT c.*, p.sexo as sexo_paciente, p.nombre, p.apellido
                FROM camas c
                LEFT JOIN pacientes p ON c.paciente_actual_id = p.id
                WHERE c.habitacion_id = ? AND c.id != ? AND c.estado = 'ocupada'
            `, [cama.habitacion_id, cama_id]);
            
            if (otrasCamas.length > 0) {
                // Hay otra cama ocupada, verificar sexo del paciente
                const [pacienteInfo] = await pool.execute(
                    'SELECT sexo, nombre, apellido FROM pacientes WHERE id = ?',
                    [paciente_id]
                );
                
                const sexoPacienteNuevo = pacienteInfo[0].sexo;
                const sexoPacienteExistente = otrasCamas[0].sexo_paciente;
                
                if (sexoPacienteNuevo !== sexoPacienteExistente) {
                    const [pacientes] = await pool.execute('SELECT * FROM pacientes WHERE activo = TRUE');
                    const camas = await Admision.getCamasDisponibles();
                    return res.render('admisiones/new', {
                        title: 'Nueva Admisión',
                        pacientes,
                        camas,
                        error: `No se puede asignar: habitación ocupada por ${otrasCamas[0].nombre} ${otrasCamas[0].apellido} (${sexoPacienteExistente}). Regla hospitalaria: no mezclar géneros en habitaciones compartidas.`
                    });
                }
            }
        }
        
        // 3. Crear la admisión
        const admisionData = {
            paciente_id,
            cama_id,
            tipo_admision,
            medico_referente,
            diagnostico_inicial
        };
        
        await Admision.createAdmision(admisionData);
        
        // 4. Actualizar estado de la cama
        await pool.execute(
            'UPDATE camas SET estado = "ocupada", paciente_actual_id = ? WHERE id = ?',
            [paciente_id, cama_id]
        );
        
        req.session.success = 'Admisión creada exitosamente';
        res.redirect('/admisiones');
        
    } catch (error) {
        console.error('Error al procesar admisión:', error);
        res.status(500).render('error', { message: 'Error interno del servidor' });
    }
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


