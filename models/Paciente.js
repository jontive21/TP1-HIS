// models/Paciente.js
const pool = require('../config/db');
/**
 * Crea un nuevo paciente en la base de datos
 */
async function create(
    dni,
    nombre,
    apellido,
    fecha_nacimiento,
    sexo,
    telefono = null,
    email = null,
    direccion = null,
    contacto_emergencia_nombre = null,
    contacto_emergencia_telefono = null,
    contacto_emergencia_relacion = null,
    obra_social = null,
    numero_afiliado = null,
    alergias = null,
    antecedentes_medicos = null,
    medicamentos_habituales = null
) {
    try {
        const [result] = await pool.query(`
            INSERT INTO pacientes (
                dni, nombre, apellido, fecha_nacimiento, sexo, telefono, email, direccion,
                contacto_emergencia_nombre, contacto_emergencia_telefono, contacto_emergencia_relacion,
                obra_social, numero_afiliado, alergias, antecedentes_medicos, medicamentos_habituales,
                fecha_creacion
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
        `, [
            dni, nombre, apellido, fecha_nacimiento, sexo, telefono, email, direccion,
            contacto_emergencia_nombre, contacto_emergencia_telefono, contacto_emergencia_relacion,
            obra_social, numero_afiliado, alergias, antecedentes_medicos, medicamentos_habituales
        ]);
        
        console.log(`✅ Paciente creado con ID: ${result.insertId}`);
        return result.insertId;
    } catch (error) {
        console.error('❌ Error creando paciente:', error);
        throw error;
    }
}
/**
 * Busca un paciente por su DNI
 */
async function findByDni(dni) {
    try {
        const [rows] = await pool.query('SELECT * FROM pacientes WHERE dni = ? AND activo = TRUE', [dni]);
        return rows[0] || null;
    } catch (error) {
        console.error('❌ Error buscando paciente por DNI:', error);
        throw error;
    }
}
/**
 * Busca un paciente por su ID
 */
async function findById(id) {
    try {
        const [rows] = await pool.query('SELECT * FROM pacientes WHERE id = ? AND activo = TRUE', [id]);
        return rows[0] || null;
    } catch (error) {
        console.error('❌ Error buscando paciente por ID:', error);
        throw error;
    }
}
/**
 * Obtiene todos los pacientes con información básica
 */
async function getAll(limite = 100, offset = 0) {
    try {
        const [rows] = await pool.query(`
            SELECT 
                id, dni, nombre, apellido, fecha_nacimiento, sexo, 
                telefono, email, obra_social, numero_afiliado, fecha_creacion
            FROM pacientes 
            WHERE activo = TRUE
            ORDER BY apellido, nombre
            LIMIT ? OFFSET ?
        `, [limite, offset]);
        return rows;
    } catch (error) {
        console.error('❌ Error obteniendo todos los pacientes:', error);
        throw error;
    }
}
/**
 * Busca pacientes por nombre o apellido
 */
async function buscarPorNombre(busqueda, limite = 20) {
    try {
        const termino = `%${busqueda}%`;
        const [rows] = await pool.query(`
            SELECT 
                id, dni, nombre, apellido, fecha_nacimiento, sexo, 
                telefono, email, obra_social, numero_afiliado
            FROM pacientes 
            WHERE activo = TRUE 
                AND (nombre LIKE ? OR apellido LIKE ? OR CONCAT(nombre, ' ', apellido) LIKE ?)
            ORDER BY apellido, nombre
            LIMIT ?
        `, [termino, termino, termino, limite]);
        return rows;
    } catch (error) {
        console.error('❌ Error buscando pacientes por nombre:', error);
        throw error;
    }
}
/**
 * Actualiza información de un paciente
 */
async function update(id, datosActualizados) {
    try {
        const campos = [];
        const valores = [];
        // Construir query dinámicamente con solo los campos a actualizar
        Object.keys(datosActualizados).forEach(campo => {
            if (datosActualizados[campo] !== undefined) {
                campos.push(`${campo} = ?`);
                valores.push(datosActualizados[campo]);
            }
        });
        if (campos.length === 0) {
            return false; // No hay nada que actualizar
        }
        // Agregar fecha de actualización
        campos.push('fecha_actualizacion = NOW()');
        valores.push(id);
        const [result] = await pool.query(`
            UPDATE pacientes 
            SET ${campos.join(', ')}
            WHERE id = ? AND activo = TRUE
        `, valores);
        console.log(`✅ Paciente ${id} actualizado`);
        return result.affectedRows > 0;
    } catch (error) {
        console.error('❌ Error actualizando paciente:', error);
        throw error;
    }
}
/**
 * Obtiene el historial de admisiones de un paciente
 */
async function getHistorialAdmisiones(pacienteId) {
    try {
        const [rows] = await pool.query(`
            SELECT 
                a.*,
                c.numero_cama,
                h.numero as numero_habitacion,
                h.tipo_habitacion
            FROM admisiones a
            JOIN camas c ON a.cama_id = c.id
            JOIN habitaciones h ON c.habitacion_id = h.id
            WHERE a.paciente_id = ?
            ORDER BY a.fecha_ingreso DESC
        `, [pacienteId]);
        return rows;
    } catch (error) {
        console.error('❌ Error obteniendo historial de admisiones:', error);
        throw error;
    }
}
/**
 * Verifica si un paciente tiene admisiones activas
 */
async function tieneAdmisionActiva(pacienteId) {
    try {
        const [rows] = await pool.query(`
            SELECT COUNT(*) as cantidad
            FROM admisiones 
            WHERE paciente_id = ? AND estado = 'activa'
        `, [pacienteId]);
        return rows[0].cantidad > 0;
    } catch (error) {
        console.error('❌ Error verificando admisión activa:', error);
        throw error;
    }
}
/**
 * Obtiene estadísticas de pacientes
 */
async function getEstadisticas() {
    try {
        const [rows] = await pool.query(`
            SELECT 
                COUNT(*) as total_pacientes,
                SUM(CASE WHEN DATE(fecha_creacion) = CURDATE() THEN 1 ELSE 0 END) as nuevos_hoy,
                SUM(CASE WHEN DATE(fecha_creacion) >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) THEN 1 ELSE 0 END) as nuevos_semana,
                SUM(CASE WHEN sexo = 'M' THEN 1 ELSE 0 END) as masculinos,
                SUM(CASE WHEN sexo = 'F' THEN 1 ELSE 0 END) as femeninos
            FROM pacientes 
            WHERE activo = TRUE
        `);
        
        return rows[0] || {
            total_pacientes: 0,
            nuevos_hoy: 0,
            nuevos_semana: 0,
            masculinos: 0,
            femeninos: 0
        };
    } catch (error) {
        console.error('❌ Error obteniendo estadísticas de pacientes:', error);
        return {
            total_pacientes: 0,
            nuevos_hoy: 0,
            nuevos_semana: 0,
            masculinos: 0,
            femeninos: 0
        };
    }
}
/**
 * Desactiva un paciente (soft delete)
 */
async function desactivar(id, motivoDesactivacion = null) {
    try {
        const [result] = await pool.query(`
            UPDATE pacientes 
            SET 
                activo = FALSE,
                fecha_actualizacion = NOW(),
                motivo_desactivacion = ?
            WHERE id = ?
        `, [motivoDesactivacion, id]);
        
        console.log(`⚠️ Paciente ${id} desactivado`);
        return result.affectedRows > 0;
    } catch (error) {
        console.error('❌ Error desactivando paciente:', error);
        throw error;
    }
}
/**
 * Reactiva un paciente
 */
async function reactivar(id) {
    try {
        const [result] = await pool.query(`
            UPDATE pacientes 
            SET 
                activo = TRUE,
                fecha_actualizacion = NOW(),
                motivo_desactivacion = NULL
            WHERE id = ?
        `, [id]);
        
        console.log(`✅ Paciente ${id} reactivado`);
        return result.affectedRows > 0;
    } catch (error) {
        console.error('❌ Error reactivando paciente:', error);
        throw error;
    }
}
/**
 * Obtiene pacientes con admisiones activas
 */
async function getPacientesInternados() {
    try {
        const [rows] = await pool.query(`
            SELECT DISTINCT
                p.id, p.dni, p.nombre, p.apellido, p.fecha_nacimiento, p.sexo,
                p.telefono, p.obra_social,
                a.id as admision_id, a.fecha_ingreso,
                c.numero_cama, h.numero as numero_habitacion
            FROM pacientes p
            JOIN admisiones a ON p.id = a.paciente_id
            JOIN camas c ON a.cama_id = c.id
            JOIN habitaciones h ON c.habitacion_id = h.id
            WHERE p.activo = TRUE AND a.estado = 'activa'
            ORDER BY a.fecha_ingreso DESC
        `);
        return rows;
    } catch (error) {
        console.error('❌ Error obteniendo pacientes internados:', error);
        throw error;
    }
}
/**
 * Valida que un DNI no esté duplicado
 */
async function validarDniUnico(dni, idExcluir = null) {
    try {
        let query = 'SELECT COUNT(*) as cantidad FROM pacientes WHERE dni = ? AND activo = TRUE';
        let params = [dni];
        
        if (idExcluir) {
            query += ' AND id != ?';
            params.push(idExcluir);
        }
        
        const [rows] = await pool.query(query, params);
        return rows[0].cantidad === 0; // true si es único
    } catch (error) {
        console.error('❌ Error validando DNI único:', error);
        return false;
    }
}
module.exports = {
    create,
    findByDni,
    findById,
    getAll,
    buscarPorNombre,
    update,
    getHistorialAdmisiones,
    tieneAdmisionActiva,
    getEstadisticas,
    desactivar,
    reactivar,
    getPacientesInternados,
    validarDniUnico
};