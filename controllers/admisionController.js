// controllers/admisionController.js
const pool = require('../database/connection');

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
            'SELECT * FROM pacientes WHERE estado != "alta" ORDER BY apellido, nombre'
        );
        const [camas] = await pool.query(`
            SELECT c.id, h.numero AS habitacion_numero, c.numero AS cama_numero 
            FROM camas c
            JOIN habitaciones h ON c.habitacion_id = h.id
            WHERE c.limpia = TRUE AND c.ocupada = FALSE
        `);

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
    const { paciente_id, cama_id, tipo_admision, medico_referente, diagnostico_inicial } = req.body;

    if (!paciente_id || !cama_id) {
        req.flash('error', 'Datos incompletos');
        return res.redirect('/admisiones/crear');
    }

    try {
        await pool.beginTransaction();

        // Verificar disponibilidad de la cama
        const [camas] = await pool.query(
            'SELECT * FROM camas WHERE id = ? AND limpia = TRUE AND ocupada = FALSE',
            [cama_id]
        );

        if (!camas.length) {
            req.flash('error', 'La cama seleccionada no está disponible.');
            return res.redirect('/admisiones/crear');
        }

        // Registrar admisión
        await pool.query(
            'INSERT INTO admisiones SET ?', 
            {
                paciente_id,
                cama_id,
                tipo_admision,
                medico_referente,
                diagnostico_inicial,
                fecha_ingreso: new Date()
            }
        );

        // Marcar cama como ocupada
        await pool.query('UPDATE camas SET ocupada = TRUE WHERE id = ?', [cama_id]);

        await pool.commit();
        req.flash('success', 'Admisión creada correctamente');
        res.redirect('/admisiones');

    } catch (error) {
        await pool.rollback();
        console.error('Error al crear admisión:', error.message);
        req.flash('error', 'No se pudo crear la admisión');
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

        const admision = rows[0];
        if (admision.fecha_ingreso) admision.fecha_ingreso = new Date(admision.fecha_ingreso);
        if (admision.fecha_cancelacion) admision.fecha_cancelacion = new Date(admision.fecha_cancelacion);

        res.render('admisiones/detalle', { admision });
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { message: 'Error al cargar el detalle de la admisión' });
    }
};

// Cancelar admisión
exports.cancelarAdmision = async (req, res) => {
    const admisionId = req.body.admision_id || req.params.id;

    try {
        const [admisiones] = await pool.query(
            'SELECT cama_id FROM admisiones WHERE id = ?', [admisionId]
        );

        if (!admisiones.length) {
            req.flash('error', 'Admisión no encontrada');
            return res.redirect('/admisiones');
        }

        const camaId = admisiones[0].cama_id;

        await pool.beginTransaction();

        // Liberar cama
        await pool.query('UPDATE camas SET ocupada = FALSE WHERE id = ?', [camaId]);

        // Actualizar admisión
        await pool.query('UPDATE admisiones SET fecha_cancelacion = NOW() WHERE id = ?', [admisionId]);

        await pool.commit();
        req.flash('success', 'Admisión cancelada correctamente');
        res.redirect('/admisiones');

    } catch (error) {
        await pool.rollback();
        console.error('Error al cancelar admisión:', error.message);
        req.flash('error', 'No se pudo cancelar la admisión');
        res.redirect('/admisiones');
    }
};