// controllers/admisionController.js
const { pool } = require('../database/connection');

// Listar admisiones activas
exports.listarAdmisiones = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT a.id, 
                   p.nombre AS paciente_nombre, 
                   p.apellido AS paciente_apellido, 
                   c.numero AS cama_numero, 
                   h.numero AS habitacion_numero,
                   a.tipo_admision,
                   a.fecha_ingreso
            FROM admisiones a
            JOIN pacientes p ON a.paciente_id = p.id
            JOIN camas c ON a.cama_id = c.id
            JOIN habitaciones h ON c.habitacion_id = h.id
            WHERE a.fecha_cancelacion IS NULL
            ORDER BY a.id DESC
        `);

        res.render('admisiones/list', { admisiones: rows });

    } catch (err) {
        console.error('Error al listar admisiones:', err.message);
        req.session.error = 'No se pudo cargar el listado de admisiones';
        res.redirect('/dashboard');
    }
};

// Mostrar formulario de nueva admisión
exports.showNuevaAdmision = async (req, res) => {
    try {
        const { id } = req.params;

        const [pacientes] = await pool.query('SELECT * FROM pacientes ORDER BY apellido, nombre');
        const [camas] = await pool.query(`
            SELECT c.id, h.numero AS habitacion_numero, c.numero AS cama_numero 
            FROM camas c
            JOIN habitaciones h ON c.habitacion_id = h.id
            WHERE c.limpia = TRUE AND c.ocupada = FALSE
        `);

        res.render('admisiones/crear', { pacientes, camas });

    } catch (err) {
        console.error('Error al cargar formulario:', err.message);
        req.session.error = 'No se pudo cargar el formulario de admisión';
        res.redirect('/dashboard');
    }
};

// Asignar cama al paciente
exports.asignarCama = async (req, res) => {
    const { paciente_id, cama_id, sexo } = req.body;

    if (!paciente_id || !cama_id) {
        req.session.error = 'Datos incompletos - Paciente y Cama son obligatorios';
        return res.redirect('/admisiones/crear');
    }

    try {
        // Verificar disponibilidad de la cama
        const [camas] = await pool.query(
            'SELECT * FROM camas WHERE id = ? AND limpia = TRUE AND ocupada = FALSE',
            [cama_id]
        );

        if (!camas.length) {
            req.session.error = 'La cama seleccionada no está disponible.';
            return res.redirect('/admisiones/crear');
        }

        // Validar género en habitaciones dobles
        const [paciente] = await pool.query(`
          SELECT p.sexo 
          FROM pacientes p
          JOIN camas c ON p.cama_id = c.id
          WHERE c.id = ?
          LIMIT 1`, [cama_id]
        );

        if (paciente.length > 0 && paciente[0].sexo !== sexo) {
            req.session.error = 'No se pueden mezclar géneros en habitaciones dobles';
            return res.redirect(`/admisiones/${paciente_id}`);
        }

        // Asignar cama y actualizar estado del paciente
        await pool.query(
            'UPDATE pacientes SET cama_id = ?, estado = "internado" WHERE id = ?', 
            [cama_id, paciente_id]
        );
        await pool.query('UPDATE camas SET ocupada = TRUE WHERE id = ?', [cama_id]);

        req.session.success = 'Paciente admitido correctamente';
        res.redirect('/dashboard');

    } catch (err) {
        console.error('Error al asignar cama:', err.message);
        req.session.error = 'No se pudo asignar la cama';
        res.redirect(`/admisiones/${req.body.paciente_id}`);
    }
};