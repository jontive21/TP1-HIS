const { query } = require('../database/emergencyDb'); // Usa la nueva función query

// Listar admisiones (versión optimizada con límite y modo emergencia)
exports.listarAdmisiones = async (req, res) => {
    try {
        // Consulta optimizada con LIMIT
        const admisiones = await query(`
            SELECT a.id, 
                   p.nombre, 
                   p.apellido, 
                   DATE_FORMAT(a.fecha_ingreso, '%d/%m/%Y %H:%i') as fecha_formateada,
                   c.numero_cama as numero_cama
            FROM admisiones a
            JOIN pacientes p ON a.paciente_id = p.id
            JOIN camas c ON a.cama_id = c.id
            ORDER BY a.fecha_ingreso DESC
            LIMIT 50  // ¡Límite crítico!
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
        console.error('🚨 ERROR CRÍTICO en listarAdmisiones:', {
            code: error.code,
            message: error.message,
            stack: error.stack
        });
        
        // Modo de emergencia con datos de prueba
        if (error.code === 'ETIMEDOUT' || error.code === 'ECONNRESET') {
            console.warn('⚠️ Usando datos de demostración por timeout');
            return res.render('admisiones/list', { 
                admisiones: [
                    {
                        id: 1,
                        nombre: "Paciente",
                        apellido: "Demo",
                        fecha_formateada: "01/01/2025 10:00",
                        numero_cama: "101A"
                    }
                ],
                error: 'Base de datos no responde - Modo demostración'
            });
        }
        
        let errorMessage = 'Error al cargar el listado de admisiones';
        
        if (error.code === 'ER_ACCESS_DENIED_ERROR') {
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

// Mostrar formulario (versión optimizada usando query)
exports.mostrarFormulario = async (req, res) => {
    try {
        const pacientes = await query(`
            SELECT id, CONCAT(nombre, ' ', apellido) as nombre_completo 
            FROM pacientes
        `);
        
        const camas = await query(`
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

// Crear admisión (versión optimizada usando query con transacción)
exports.crearAdmision = async (req, res) => {
    const { paciente_id, cama_id } = req.body;
    
    if (!paciente_id || !cama_id) {
        req.session.error = 'Debe seleccionar un paciente y una cama';
        return res.redirect('/admisiones/nueva');
    }
    
    try {
        // Iniciar transacción manual con query
        await query('START TRANSACTION');
        
        // 1. Registrar admisión
        await query(`
            INSERT INTO admisiones (paciente_id, cama_id, fecha_ingreso)
            VALUES (?, ?, NOW())
        `, [paciente_id, cama_id]);
        
        // 2. Actualizar estado de cama
        await query(`
            UPDATE camas 
            SET ocupada = TRUE 
            WHERE id = ?
        `, [cama_id]);
        
        await query('COMMIT');
        
        req.session.success = 'Admisión registrada exitosamente';
        res.redirect('/admisiones');
    } catch (error) {
        await query('ROLLBACK');
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
    }
};