const { pool } = require('../database/connection');

// Listar admisiones (versión corregida)
exports.listarAdmisiones = async (req, res) => {
    try {
        const [admisiones] = await pool.query(`
            SELECT a.id, 
                   p.nombre, 
                   p.apellido, 
                   DATE_FORMAT(a.fecha_ingreso, '%d/%m/%Y %H:%i') as fecha_formateada,
                   c.numero as numero_cama
            FROM admisiones a
            JOIN pacientes p ON a.paciente_id = p.id
            JOIN camas c ON a.cama_id = c.id
            ORDER BY a.fecha_ingreso DESC
        `);
        
        // Capturar mensajes de sesión y limpiarlos
        const successMsg = req.session.success || null;
        const errorMsg = req.session.error || null;
        
        // Limpiar mensajes después de usarlos
        req.session.success = null;
        req.session.error = null;
        
        res.render('admisiones/list', { 
            admisiones,
            success: successMsg,
            error: errorMsg
        });
        
    } catch (error) {
        console.error('Error listando admisiones:', error);
        req.session.error = 'Error al cargar el listado de admisiones: ' + error.message;
        res.redirect('/dashboard');
    }
};

// Mostrar formulario (versión corregida)
exports.mostrarFormulario = async (req, res) => {
    try {
        const [pacientes] = await pool.query(`
            SELECT id, CONCAT(nombre, ' ', apellido) as nombre_completo 
            FROM pacientes
        `);
        
        const [camas] = await pool.query(`
            SELECT id, numero 
            FROM camas 
            WHERE ocupada = FALSE
        `);
        
        // Capturar mensaje de error y limpiarlo
        const errorMsg = req.session.error || null;
        req.session.error = null;
        
        res.render('admisiones/nueva', { 
            pacientes, 
            camas,
            error: errorMsg
        });
        
    } catch (error) {
        console.error('Error cargando formulario:', error);
        req.session.error = 'Error al cargar el formulario de admisión: ' + error.message;
        res.redirect('/admisiones');
    }
};

// Crear admisión (versión corregida)
exports.crearAdmision = async (req, res) => {
    const { paciente_id, cama_id } = req.body;
    
    if (!paciente_id || !cama_id) {
        req.session.error = 'Debe seleccionar un paciente y una cama';
        return res.redirect('/admisiones/nueva');
    }
    
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        
        // 1. Registrar admisión
        await connection.query(`
            INSERT INTO admisiones (paciente_id, cama_id, fecha_ingreso)
            VALUES (?, ?, NOW())
        `, [paciente_id, cama_id]);
        
        // 2. Actualizar estado de cama
        await connection.query(`
            UPDATE camas SET ocupada = TRUE WHERE id = ?
        `, [cama_id]);
        
        await connection.commit();
        
        req.session.success = 'Admisión registrada exitosamente';
        res.redirect('/admisiones');
    } catch (error) {
        await connection.rollback();
        console.error('Error creando admisión:', error);
        
        let errorMessage = 'Error al crear la admisión';
        if (error.code === 'ER_DUP_ENTRY') {
            errorMessage = 'La cama ya está ocupada por otro paciente';
        } else if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            errorMessage = 'Datos inválidos (paciente o cama no existe)';
        } else if (error.code === 'ER_BAD_NULL_ERROR') {
            errorMessage = 'Datos incompletos';
        } else {
            errorMessage += `: ${error.message}`;
        }
        
        req.session.error = errorMessage;
        res.redirect('/admisiones/nueva');
    } finally {
        if (connection) connection.release();
    }
};