// models/Admision.js
const pool = require('../config/db');
/**
 * Obtiene todas las admisiones
 */
async function getAll() {
    try {
        const [rows] = await pool.query(`
            SELECT 
                a.*,
                p.nombre,
                p.apellido,
                p.dni,
                c.numero_cama,
                h.numero as numero_habitacion
            FROM admisiones a
            JOIN pacientes p ON a.paciente_id = p.id
            JOIN camas c ON a.cama_id = c.id
            JOIN habitaciones h ON c.habitacion_id = h.id
            ORDER BY a.fecha_ingreso DESC
        `);
        return rows;
    } catch (error) {
        console.error('❌ Error obteniendo todas las admisiones:', error);
        throw error;
    }
}
/**
 * Obtiene admisiones recientes
 */
async function getRecientes(limite = 10) {
    try {
        const [rows] = await pool.query(`
            SELECT 
                a.*,
                p.nombre,
                p.apellido,
                p.dni,
                c.numero_cama,
                h.numero as numero_habitacion
            FROM admisiones a
            JOIN pacientes p ON a.paciente_id = p.id
            JOIN camas c ON a.cama_id = c.id
            JOIN habitaciones h ON c.habitacion_id = h.id
            WHERE a.estado = 'activa'
            ORDER BY a.fecha_ingreso DESC
            LIMIT ?
        `, [limite]);
        return rows;
    } catch (error) {
        console.error('❌ Error obteniendo admisiones recientes:', error);
        throw error;
    }
}
/**
 * Busca una admisión por ID
 */
async function findById(id) {
    try {
        const [rows] = await pool.query('SELECT * FROM admisiones WHERE id = ?', [id]);
        return rows[0] || null;
    } catch (error) {
        console.error('❌ Error obteniendo admisión por ID:', error);
        throw error;
    }
}
/**
 * Busca una admisión por ID con detalles completos
 */
async function findByIdWithDetails(id) {
    try {
        const [rows] = await pool.query(`
            SELECT 
                a.*,
                p.nombre,
                p.apellido,
                p.dni,
                p.fecha_nacimiento,
                p.sexo,
                p.telefono,
                p.email,
                p.obra_social,
                c.numero_cama,
                h.numero as numero_habitacion,
                h.tipo_habitacion
            FROM admisiones a
            JOIN pacientes p ON a.paciente_id = p.id
            JOIN camas c ON a.cama_id = c.id
            JOIN habitaciones h ON c.habitacion_id = h.id
            WHERE a.id = ?
        `, [id]);
        return rows[0] || null;
    } catch (error) {
        console.error('❌ Error obteniendo admisión con detalles:', error);
        throw error;
    }
}
/**
 * Busca admisión activa por cama
 */
async function findByCamaId(cama_id) {
    try {
        const [rows] = await pool.query(`
            SELECT * FROM admisiones 
            WHERE cama_id = ? AND estado = 'activa'
            ORDER BY fecha_ingreso DESC
            LIMIT 1
        `, [cama_id]);
        return rows[0] || null;
    } catch (error) {
        console.error('❌ Error obteniendo admisión por cama:', error);
        throw error;
    }
}
/**
 * Crea una nueva admisión
 */
async function create(
    paciente_id,
    cama_id,
    medico_responsable_id,
    fecha_ingreso,
    motivo_internacion,
    tipo_ingreso = 'programada',
    observaciones = null,
    usuario_creacion = 'sistema'
) {
    try {
        const [result] = await pool.query(`
            INSERT INTO admisiones (
                paciente_id,
                cama_id,
                medico_responsable_id,
                fecha_ingreso,
                motivo_internacion,
                tipo_ingreso,
                observaciones,
                estado,
                usuario_creacion,
                fecha_creacion
            ) VALUES (?, ?, ?, ?, ?, ?, ?, 'activa', ?, NOW())
        `, [
            paciente_id,
            cama_id,
            medico_responsable_id,
            fecha_ingreso,
            motivo_internacion,
            tipo_ingreso,
            observaciones,
            usuario_creacion
        ]);
        
        console.log(`✅ Admisión creada con ID: ${result.insertId}`);
        return result.insertId;
    } catch (error) {
        console.error('❌ Error creando admisión:', error);
        throw error;
    }
}
/**
 * Cancela una admisión
 */
async function cancelar(id, motivo_cancelacion, usuario_cancelacion) {
    try {
        const [result] = await pool.query(`
            UPDATE admisiones 
            SET 
                estado = 'cancelada',
                motivo_cancelacion = ?,
                usuario_cancelacion = ?,
                fecha_cancelacion = NOW()
            WHERE id = ?
        `, [motivo_cancelacion, usuario_cancelacion, id]);
        
        return result.affectedRows > 0;
    } catch (error) {
        console.error('❌ Error cancelando admisión:', error);
        throw error;
    }
}
/**
 * Obtiene estadísticas del módulo
 */
async function getEstadisticas() {
    try {
        const [estadisticas] = await pool.query(`
            SELECT 
                COUNT(*) as total_admisiones,
                SUM(CASE WHEN estado = 'activa' THEN 1 ELSE 0 END) as admisiones_activas,
                SUM(CASE WHEN estado = 'cancelada' THEN 1 ELSE 0 END) as admisiones_canceladas,
                SUM(CASE WHEN DATE(fecha_ingreso) = CURDATE() THEN 1 ELSE 0 END) as admisiones_hoy
            FROM admisiones
        `);
        
        return estadisticas[0] || {
            total_admisiones: 0,
            admisiones_activas: 0,
            admisiones_canceladas: 0,
            admisiones_hoy: 0
        };
    } catch (error) {
        console.error('❌ Error obteniendo estadísticas:', error);
        return {
            total_admisiones: 0,
            admisiones_activas: 0,
            admisiones_canceladas: 0,
            admisiones_hoy: 0
        };
    }
}
/**
 * Actualiza estado de admisión
 */
async function updateEstado(id, estado) {
    try {
        const [result] = await pool.query(`
            UPDATE admisiones 
            SET estado = ?, fecha_actualizacion = NOW()
            WHERE id = ?
        `, [estado, id]);
        
        return result.affectedRows > 0;
    } catch (error) {
        console.error('❌ Error actualizando estado de admisión:', error);
        throw error;
    }
}
module.exports = {
    getAll,
    getRecientes,
    findById,
    findByIdWithDetails,
    findByCamaId,
    create,
    cancelar,
    getEstadisticas,
    updateEstado
};