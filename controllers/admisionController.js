const { pool } = require('../database/connection');

// Listar admisiones (versión optimizada)
exports.listarAdmisiones = async (req, res) => {
    try {
        const [admisiones] = await pool.query(`
            SELECT a.id, 
                   p.nombre, 
                   p.apellido, 
                   DATE_FORMAT(a.fecha_ingreso, '%d/%m/%Y %H:%i') as fecha_formateada,
                   c.numero_cama as numero_cama
            FROM admisiones a
            JOIN pacientes p ON a.paciente_id = p.id
            JOIN camas c ON a.cama_id = c.id
            ORDER BY a.fecha_ingreso DESC
        `);
        
        const successMsg = req.session.success || null;
        const errorMsg = req.session.error || null;
        req.session.success = null;
        req.session.error = null;
        
        res.render('admisiones/list', { 
            admisiones,
            success: successMsg,
            error: errorMsg
        });
        
    } catch (error) {
        console.error('Error listando admisiones:', {
            code: error.code,
            message: error.message,
            sqlState: error.sqlState
        });
        
        let errorMessage = 'Error al cargar el listado de admisiones';
        
        if (error.code === 'ETIMEDOUT') {
            errorMessage = 'El servidor de base de datos no responde. Contacte al administrador.';
        } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
            errorMessage = 'Credenciales de base de datos incorrectas.';
        } else if (error.code === 'ER_NO_SUCH_TABLE') {
            errorMessage = 'Tabla de admisiones no encontrada. Verifique la base de datos.';
        } else if (error.code === 'ENOTFOUND') {
            errorMessage = 'No se puede resolver el host de la base de datos.';
        } else if (error.sqlState) {
            errorMessage += ` (Código SQL: ${error.sqlState})`;
        }
        
        req.session.error = errorMessage;
        res.redirect('/dashboard');
    }
};

// Mostrar formulario (versión optimizada)
exports.mostrarFormulario = async (req, res) => {
    try {
        const [pacientes] = await pool.query(`
            SELECT id, CONCAT(nombre, ' ', apellido) as nombre_completo 
            FROM pacientes
        `);
        
        const [camas] = await pool.query(`
            SELECT id, numero_cama as numero 
            FROM camas 
            WHERE estado = 'libre'
        `);
        
        const errorMsg = req.session.error || null;
        req.session.error = null;
        
        res.render('admisiones/nueva', { 
            pacientes, 
            camas,
            error: errorMsg
        });
        
    } catch (error) {
        console.error('Error cargando formulario:', {
            code: error.code,
            message: error.message,
            sqlState: error.sqlState
        });
        
        req.session.error = 'Error al cargar el formulario: ' + error.message;
        res.redirect('/admisiones');
    }
};

// Crear admisión (versión optimizada)
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
            UPDATE camas 
            SET ocupada = TRUE 
            WHERE id = ?
        `, [cama_id]);
        
        await connection.commit();
        
        req.session.success = 'Admisión registrada exitosamente';
        res.redirect('/admisiones');
    } catch (error) {
        await connection.rollback();
        console.error('Error creando admisión:', {
            code: error.code,
            message: error.message,
            sqlState: error.sqlState
        });
        
        let errorMessage = 'Error al crear la admisión';
        
        if (error.code === 'ER_DUP_ENTRY') {
            errorMessage = 'La cama ya está ocupada por otro paciente';
        } else if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            errorMessage = 'Paciente o cama no existe';
        } else if (error.code === 'ER_BAD_NULL_ERROR') {
            errorMessage = 'Datos incompletos';
        } else if (error.sqlState) {
            errorMessage += ` (Código SQL: ${error.sqlState})`;
        }
        
        req.session.error = errorMessage;
        res.redirect('/admisiones/nueva');
    } finally {
        if (connection) connection.release();
    }
};