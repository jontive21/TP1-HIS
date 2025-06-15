const { pool } = require('../database/connection');

// Listar admisiones (versión mínima)
exports.listarAdmisiones = async (req, res) => {
    try {
        const [admisiones] = await pool.query(`
            SELECT a.id, p.nombre, p.apellido, a.fecha_ingreso
            FROM admisiones a
            JOIN pacientes p ON a.paciente_id = p.id
            ORDER BY a.id DESC
        `);
        
        res.render('admisiones/list', { admisiones });
    } catch (error) {
        console.error('Error listando admisiones:', error);
        req.session.error = 'Error al cargar admisiones';
        res.redirect('/dashboard');
    }
};

// Mostrar formulario (versión mínima)
exports.mostrarFormulario = async (req, res) => {
    try {
        const [pacientes] = await pool.query('SELECT id, nombre, apellido FROM pacientes');
        const [camas] = await pool.query('SELECT id FROM camas WHERE ocupada = FALSE');
        
        res.render('admisiones/nueva', { pacientes, camas });
    } catch (error) {
        console.error('Error cargando formulario:', error);
        req.session.error = 'Error al cargar formulario';
        res.redirect('/admisiones');
    }
};

// Crear admisión (versión mínima)
exports.crearAdmision = async (req, res) => {
    const { paciente_id, cama_id } = req.body;
    
    try {
        // Validación básica
        if (!paciente_id || !cama_id) {
            req.session.error = 'Debe completar todos los campos';
            return res.redirect('/admisiones/nueva');
        }
        
        // Registrar admisión
        await pool.query(`
            INSERT INTO admisiones (paciente_id, cama_id, fecha_ingreso)
            VALUES (?, ?, NOW())
        `, [paciente_id, cama_id]);
        
        // Actualizar estado de cama
        await pool.query('UPDATE camas SET ocupada = TRUE WHERE id = ?', [cama_id]);
        
        req.session.success = 'Admisión creada correctamente';
        res.redirect('/admisiones');
    } catch (error) {
        console.error('Error creando admisión:', error);
        req.session.error = 'Error al crear admisión: ' + error.message;
        res.redirect('/admisiones/nueva');
    }
};