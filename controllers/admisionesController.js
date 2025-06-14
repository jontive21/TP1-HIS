const Admision = require('../models/Admision');
const camaService = require('../services/camaService');
const { pool } = require('../config/db');

// Listar admisiones activas
exports.listarAdmisiones = async (req, res) => {
    try {
        const [admisiones] = await pool.query(`
            SELECT a.id, 
                   p.nombre AS paciente_nombre, 
                   p.apellido AS paciente_apellido, 
                   c.numero AS cama_numero, 
                   h.numero AS habitacion_numero,
                   a.tipo_admision,
                   a.medico_referente,
                   a.diagnostico_inicial,
                   a.fecha_ingreso
            FROM admisiones a
            JOIN pacientes p ON a.paciente_id = p.id
            JOIN camas c ON a.cama_id = c.id
            JOIN habitaciones h ON c.habitacion_id = h.id
            WHERE a.fecha_cancelacion IS NULL
            ORDER BY a.id DESC
        `);

        admisiones.forEach(a => {
            if (a.fecha_ingreso) a.fecha_ingreso = new Date(a.fecha_ingreso);
        });

        res.render('admisiones/list', { admisiones });
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { message: 'Error al cargar el listado de admisiones' });
    }
};

// Mostrar formulario para nueva admisión
exports.showNuevaAdmision = async (req, res) => {
    try {
        const [pacientes] = await pool.query(
            'SELECT * FROM pacientes WHERE activo = TRUE ORDER BY apellido, nombre'
        );
        const [camas] = await pool.query(
            'SELECT c.*, h.numero AS habitacion_numero FROM camas c JOIN habitaciones h ON c.habitacion_id = h.id WHERE c.limpia = TRUE AND c.ocupada = FALSE'
        );
        res.render('admisiones/crear', {
            pacientes,
            camas
        });
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { message: 'Error al cargar el formulario de admisión' });
    }
};

// Procesar nueva admisión
exports.processAdmision = async (req, res) => {
    try {
        const { paciente_id, cama_id, tipo_admision, medico_referente, diagnostico_inicial } = req.body;

        // Validar que la cama esté libre
        const [camas] = await pool.query(
            'SELECT * FROM camas WHERE id = ? AND ocupada = FALSE AND limpia = TRUE',
            [cama_id]
        );
        if (!camas.length) {
            req.session.error = 'La cama seleccionada no está disponible.';
            return res.redirect('/admisiones/crear');
        }

        // Crear admisión y marcar cama como ocupada
        await pool.beginTransaction();
        try {
            if (await camaService.camaDisponible(cama_id)) {
                await camaService.asignarCama(cama_id);
                await pool.query(
                    'INSERT INTO admisiones (paciente_id, cama_id, tipo_admision, medico_referente, diagnostico_inicial, fecha_ingreso) VALUES (?, ?, ?, ?, ?, NOW())',
                    [paciente_id, cama_id, tipo_admision, medico_referente, diagnostico_inicial]
                );
                await pool.query(
                    'UPDATE camas SET ocupada = TRUE WHERE id = ?',
                    [cama_id]
                );
                await pool.commit();
                req.session.success = 'Admisión creada correctamente';
                res.redirect('/admisiones');
            } else {
                req.session.error = 'La cama seleccionada no está disponible.';
                return res.redirect('/admisiones/crear');
            }
        } catch (error) {
            await pool.rollback();
            req.session.error = 'Error al crear la admisión';
            res.redirect('/admisiones/crear');
        }
    } catch (error) {
        console.error(error);
        req.session.error = 'Error al crear la admisión';
        res.redirect('/admisiones/crear');
    }
};

// Detalle de admisión
exports.detalleAdmision = async (req, res) => {
    const id = req.params.id;
    try {
        const [rows] = await pool.query(`
            SELECT a.*, 
                   p.nombre AS paciente_nombre, 
                   p.apellido AS paciente_apellido, 
                   c.numero AS cama_numero, 
                   h.numero AS habitacion_numero
            FROM admisiones a
            JOIN pacientes p ON a.paciente_id = p.id
            JOIN camas c ON a.cama_id = c.id
            JOIN habitaciones h ON c.habitacion_id = h.id
            WHERE a.id = ?
            LIMIT 1
        `, [id]);

        if (!rows.length) {
            return res.render('admisiones/detalle', { admision: null });
        }

        if (rows[0].fecha_ingreso) rows[0].fecha_ingreso = new Date(rows[0].fecha_ingreso);
        if (rows[0].fecha_cancelacion) rows[0].fecha_cancelacion = new Date(rows[0].fecha_cancelacion);

        res.render('admisiones/detalle', { admision: rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { message: 'Error al cargar el detalle de la admisión' });
    }
};

// Cancelar admisión
exports.cancelarAdmision = async (req, res) => {
    const admisionId = req.body.admision_id || req.params.id;
    try {
        // Buscar la admisión y obtener la cama asociada
        const [admisiones] = await pool.query(
            'SELECT cama_id FROM admisiones WHERE id = ?', [admisionId]
        );
        if (!admisiones.length) {
            req.session.error = 'Admisión no encontrada';
            return res.redirect('/admisiones');
        }
        const camaId = admisiones[0].cama_id;

        // Marcar fecha de cancelación y liberar cama (transacción)
        await pool.beginTransaction();
        try {
            await pool.query(
                'UPDATE admisiones SET fecha_cancelacion = NOW() WHERE id = ?', [admisionId]
            );
            await pool.query(
                'UPDATE camas SET ocupada = FALSE WHERE id = ?', [camaId]
            );
            await pool.commit();
            req.session.success = 'Admisión cancelada correctamente';
            res.redirect('/admisiones');
        } catch (error) {
            await pool.rollback();
            req.session.error = 'Error al cancelar la admisión';
            res.redirect('/admisiones');
        }
    } catch (error) {
        console.error(error);
        req.session.error = 'Error al cancelar la admisión';
        res.redirect('/admisiones');
    }
};

const asignarCama = async (req, res) => {
  try {
    const { pacienteId, camaId } = req.body;

    // 1. Validar regla de sexo (servicio reutilizable)
    if (camaService.validarSexoHabitacion) {
      const error = await camaService.validarSexoHabitacion(pacienteId, camaId);
      if (error) {
        req.session.error = error;
        return res.redirect('/camas');
      }
    }

    // 2. Crear admisión
    await Admision.createAdmision({
      paciente_id: pacienteId,
      cama_id: camaId,
      fecha_admision: new Date()
    });

    // 3. Marcar cama como ocupada
    await camaService.asignarCama(camaId);

    req.session.success = 'Paciente admitido correctamente';
    res.redirect('/pacientes');
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { message: 'Error en asignación' });
  }
};



