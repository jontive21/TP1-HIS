const { pool } = require('../database/connection');

// Listar admisiones (versión definitiva con nombres corregidos)
exports.listarAdmisiones = async (req, res) => {
    try {
        const [admisiones] = await pool.query(`
            SELECT a.id, 
                   p.nombre, 
                   p.apellido, 
                   DATE_FORMAT(a.fecha_ingreso, '%d/%m/%Y %H:%i') as fecha_formateada,
                   c.numero as numero_cama
            FROM admissions a
            JOIN pacientes p ON a.paciente_id = p.id
            JOIN camas c ON a.cama_id = c.id
            ORDER BY a.fecha_ingreso DESC
        `);
        
        res.render('admisiones/list', { 
            admisiones,
            success: req.session.success,
            error: req.session.error
        });
        
        // Limpiar mensajes después de mostrarlos
        req.session.success = null;
        req.session.error = null;
    } catch (error) {
        console.error('Error listando admisiones:', error);
        req.session.error = 'Error al cargar el listado de admisiones: ' + error.message;
        res.redirect('/dashboard');
    }
};

// Mostrar formulario (versión definitiva)
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
        
        res.render('admisiones/nueva', { 
            pacientes, 
            camas,
            error: req.session.error
        });
        
        req.session.error = null;
    } catch (error) {
        console.error('Error cargando formulario:', error);
        req.session.error = 'Error al cargar el formulario de admisión: ' + error.message;
        res.redirect('/admisiones');
    }
};

// Crear admisión (versión definitiva)
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
            INSERT INTO admissions (paciente_id, cama_id, fecha_ingreso)
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
        }
        
        req.session.error = errorMessage;
        res.redirect('/admisiones/nueva');
    } finally {
        connection.release();
    }
};