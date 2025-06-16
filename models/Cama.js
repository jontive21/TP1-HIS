// models/Cama.js
const pool = require('../config/db');
/**
 * Crea una nueva cama
 */
async function create(numero_cama, habitacion_id, estado = 'libre') {
    try {
        const [result] = await pool.query(
            'INSERT INTO camas (numero_cama, habitacion_id, estado, fecha_creacion) VALUES (?, ?, ?, NOW())',
            [numero_cama, habitacion_id, estado]
        );
        return result.insertId;
    } catch (error) {
        console.error('❌ Error creando cama:', error);
        throw error;
    }
}
/**
 * Busca una cama por su ID
 */
async function findById(id) {
    try {
        const [rows] = await pool.query(`
            SELECT 
                c.*,
                h.numero as numero_habitacion,
                h.tipo_habitacion,
                h.ala_id
            FROM camas c
            JOIN habitaciones h ON c.habitacion_id = h.id
            WHERE c.id = ?
        `, [id]);
        return rows[0] || null;
    } catch (error) {
        console.error('❌ Error obteniendo cama por ID:', error);
        throw error;
    }
}
/**
 * Obtiene todas las camas
 */
async function getAll() {
    try {
        const [rows] = await pool.query(`
            SELECT 
                c.*,
                h.numero as numero_habitacion,
                h.tipo_habitacion,
                h.ala_id
            FROM camas c
            JOIN habitaciones h ON c.habitacion_id = h.id
            ORDER BY h.numero, c.numero_cama
        `);
        return rows;
    } catch (error) {
        console.error('❌ Error obteniendo todas las camas:', error);
        throw error;
    }
}
/**
 * Obtiene camas disponibles (libres e higienizadas)
 */
async function getDisponibles() {
    try {
        const [rows] = await pool.query(`
            SELECT 
                c.*,
                h.numero as numero_habitacion,
                h.tipo_habitacion,
                h.ala_id
            FROM camas c
            JOIN habitaciones h ON c.habitacion_id = h.id
            WHERE c.estado IN ('libre', 'higienizada')
            ORDER BY h.numero, c.numero_cama
        `);
        return rows;
    } catch (error) {
        console.error('❌ Error obteniendo camas disponibles:', error);
        throw error;
    }
}
/**
 * Obtiene camas disponibles por habitación específica
 */
async function getDisponiblesByHabitacion(habitacion_id) {
    try {
        const [rows] = await pool.query(`
            SELECT 
                c.*,
                h.numero as numero_habitacion,
                h.tipo_habitacion
            FROM camas c
            JOIN habitaciones h ON c.habitacion_id = h.id
            WHERE c.habitacion_id = ? AND c.estado IN ('libre', 'higienizada')
            ORDER BY c.numero_cama
        `, [habitacion_id]);
        return rows;
    } catch (error) {
        console.error('❌ Error obteniendo camas disponibles por habitación:', error);
        throw error;
    }
}
/**
 * Actualiza el estado de una cama
 */
async function updateEstado(id, estado) {
    try {
        const [result] = await pool.query(
            'UPDATE camas SET estado = ?, fecha_actualizacion = NOW() WHERE id = ?',
            [estado, id]
        );
        
        console.log(`✅ Cama ${id} actualizada a estado: ${estado}`);
        return result.affectedRows > 0;
    } catch (error) {
        console.error('❌ Error actualizando estado de cama:', error);
        throw error;
    }
}
/**
 * Obtiene camas por habitación
 */
async function findByHabitacion(habitacion_id) {
    try {
        const [rows] = await pool.query(`
            SELECT 
                c.*,
                h.numero as numero_habitacion,
                h.tipo_habitacion
            FROM camas c
            JOIN habitaciones h ON c.habitacion_id = h.id
            WHERE c.habitacion_id = ?
            ORDER BY c.numero_cama
        `, [habitacion_id]);
        return rows;
    } catch (error) {
        console.error('❌ Error obteniendo camas por habitación:', error);
        throw error;
    }
}
/**
 * Verifica disponibilidad de cama considerando reglas de sexo
 */
async function verificarDisponibilidad(cama_id, sexo_paciente) {
    try {
        // Obtener información de la cama
        const cama = await findById(cama_id);
        if (!cama) {
            return { disponible: false, motivo: 'Cama no encontrada' };
        }
        // Verificar estado de la cama
        if (!['libre', 'higienizada'].includes(cama.estado)) {
            return { disponible: false, motivo: 'Cama no disponible' };
        }
        // Obtener todas las camas de la habitación
        const camasHabitacion = await findByHabitacion(cama.habitacion_id);
        
        // Si es habitación individual, está disponible
        if (camasHabitacion.length === 1) {
            return { disponible: true, motivo: 'Habitación individual disponible' };
        }
        // Para habitaciones compartidas, verificar regla de sexo
        const camasOcupadas = camasHabitacion.filter(c => c.estado === 'ocupada');
        
        if (camasOcupadas.length === 0) {
            return { disponible: true, motivo: 'Habitación compartida vacía' };
        }
        // Verificar sexo de pacientes en camas ocupadas
        for (let camaOcupada of camasOcupadas) {
            const [admisionRows] = await pool.query(`
                SELECT p.sexo 
                FROM admisiones a
                JOIN pacientes p ON a.paciente_id = p.id
                WHERE a.cama_id = ? AND a.estado = 'activa'
            `, [camaOcupada.id]);
            if (admisionRows.length > 0) {
                const sexoPacienteOcupante = admisionRows[0].sexo;
                if (sexoPacienteOcupante !== sexo_paciente) {
                    return { 
                        disponible: false, 
                        motivo: 'Habitación ocupada por paciente de sexo diferente' 
                    };
                }
            }
        }
        return { disponible: true, motivo: 'Habitación compatible' };
        
    } catch (error) {
        console.error('❌ Error verificando disponibilidad de cama:', error);
        return { disponible: false, motivo: 'Error verificando disponibilidad' };
    }
}
/**
 * Obtiene estadísticas de camas
 */
async function getEstadisticas() {
    try {
        const [rows] = await pool.query(`
            SELECT 
                COUNT(*) as total_camas,
                SUM(CASE WHEN estado = 'libre' THEN 1 ELSE 0 END) as camas_libres,
                SUM(CASE WHEN estado = 'ocupada' THEN 1 ELSE 0 END) as camas_ocupadas,
                SUM(CASE WHEN estado = 'higienizada' THEN 1 ELSE 0 END) as camas_higienizadas,
                SUM(CASE WHEN estado = 'mantenimiento' THEN 1 ELSE 0 END) as camas_mantenimiento
            FROM camas
        `);
        
        return rows[0] || {
            total_camas: 0,
            camas_libres: 0,
            camas_ocupadas: 0,
            camas_higienizadas: 0,
            camas_mantenimiento: 0
        };
    } catch (error) {
        console.error('❌ Error obteniendo estadísticas de camas:', error);
        return {
            total_camas: 0,
            camas_libres: 0,
            camas_ocupadas: 0,
            camas_higienizadas: 0,
            camas_mantenimiento: 0
        };
    }
}
module.exports = {
    create,
    findById,
    getAll,
    getDisponibles,
    getDisponiblesByHabitacion,
    updateEstado,
    findByHabitacion,
    verificarDisponibilidad,
    getEstadisticas
};