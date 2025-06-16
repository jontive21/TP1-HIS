// models/Habitacion.js
const pool = require('../config/db');
/**
 * Crea una nueva habitación
 */
async function create(numero, ala_id, tipo_habitacion, estado = 'disponible') {
    try {
        const [result] = await pool.query(`
            INSERT INTO habitaciones (numero, ala_id, tipo_habitacion, estado, fecha_creacion) 
            VALUES (?, ?, ?, ?, NOW())
        `, [numero, ala_id, tipo_habitacion, estado]);
        
        console.log(`✅ Habitación ${numero} creada con ID: ${result.insertId}`);
        return result.insertId;
    } catch (error) {
        console.error('❌ Error creando habitación:', error);
        throw error;
    }
}
/**
 * Busca una habitación por su ID
 */
async function findById(id) {
    try {
        const [rows] = await pool.query(`
            SELECT 
                h.*,
                a.nombre as nombre_ala,
                a.descripcion as descripcion_ala
            FROM habitaciones h
            LEFT JOIN alas a ON h.ala_id = a.id
            WHERE h.id = ? AND h.activo = TRUE
        `, [id]);
        return rows[0] || null;
    } catch (error) {
        console.error('❌ Error obteniendo habitación por ID:', error);
        throw error;
    }
}
/**
 * Obtiene todas las habitaciones
 */
async function getAll() {
    try {
        const [rows] = await pool.query(`
            SELECT 
                h.*,
                a.nombre as nombre_ala,
                a.descripcion as descripcion_ala,
                COUNT(c.id) as total_camas,
                SUM(CASE WHEN c.estado = 'libre' THEN 1 ELSE 0 END) as camas_libres,
                SUM(CASE WHEN c.estado = 'ocupada' THEN 1 ELSE 0 END) as camas_ocupadas
            FROM habitaciones h
            LEFT JOIN alas a ON h.ala_id = a.id
            LEFT JOIN camas c ON h.id = c.habitacion_id AND c.activo = TRUE
            WHERE h.activo = TRUE
            GROUP BY h.id, h.numero, h.ala_id, h.tipo_habitacion, h.estado, a.nombre, a.descripcion
            ORDER BY h.numero
        `);
        return rows;
    } catch (error) {
        console.error('❌ Error obteniendo todas las habitaciones:', error);
        throw error;
    }
}
/**
 * Obtiene habitaciones disponibles
 */
async function getDisponibles() {
    try {
        const [rows] = await pool.query(`
            SELECT 
                h.*,
                a.nombre as nombre_ala,
                COUNT(c.id) as total_camas,
                SUM(CASE WHEN c.estado IN ('libre', 'higienizada') THEN 1 ELSE 0 END) as camas_disponibles
            FROM habitaciones h
            LEFT JOIN alas a ON h.ala_id = a.id
            LEFT JOIN camas c ON h.id = c.habitacion_id AND c.activo = TRUE
            WHERE h.activo = TRUE AND h.estado = 'disponible'
            GROUP BY h.id
            HAVING camas_disponibles > 0
            ORDER BY h.numero
        `);
        return rows;
    } catch (error) {
        console.error('❌ Error obteniendo habitaciones disponibles:', error);
        throw error;
    }
}
/**
 * Obtiene habitaciones por ala
 */
async function getByAla(ala_id) {
    try {
        const [rows] = await pool.query(`
            SELECT 
                h.*,
                a.nombre as nombre_ala,
                COUNT(c.id) as total_camas,
                SUM(CASE WHEN c.estado = 'libre' THEN 1 ELSE 0 END) as camas_libres,
                SUM(CASE WHEN c.estado = 'ocupada' THEN 1 ELSE 0 END) as camas_ocupadas
            FROM habitaciones h
            LEFT JOIN alas a ON h.ala_id = a.id
            LEFT JOIN camas c ON h.id = c.habitacion_id AND c.activo = TRUE
            WHERE h.ala_id = ? AND h.activo = TRUE
            GROUP BY h.id
            ORDER BY h.numero
        `, [ala_id]);
        return rows;
    } catch (error) {
        console.error('❌ Error obteniendo habitaciones por ala:', error);
        throw error;
    }
}
/**
 * Actualiza el estado de una habitación
 */
async function updateEstado(id, estado) {
    try {
        const [result] = await pool.query(`
            UPDATE habitaciones 
            SET estado = ?, fecha_actualizacion = NOW()
            WHERE id = ? AND activo = TRUE
        `, [estado, id]);
        
        console.log(`✅ Habitación ${id} actualizada a estado: ${estado}`);
        return result.affectedRows > 0;
    } catch (error) {
        console.error('❌ Error actualizando estado de habitación:', error);
        throw error;
    }
}
/**
 * Obtiene el estado de ocupación de una habitación
 */
async function getEstadoOcupacion(id) {
    try {
        const [rows] = await pool.query(`
            SELECT 
                h.id,
                h.numero,
                h.tipo_habitacion,
                COUNT(c.id) as total_camas,
                SUM(CASE WHEN c.estado = 'ocupada' THEN 1 ELSE 0 END) as camas_ocupadas,
                SUM(CASE WHEN c.estado = 'libre' THEN 1 ELSE 0 END) as camas_libres,
                SUM(CASE WHEN c.estado = 'higienizada' THEN 1 ELSE 0 END) as camas_higienizadas,
                SUM(CASE WHEN c.estado = 'mantenimiento' THEN 1 ELSE 0 END) as camas_mantenimiento
            FROM habitaciones h
            LEFT JOIN camas c ON h.id = c.habitacion_id AND c.activo = TRUE
            WHERE h.id = ? AND h.activo = TRUE
            GROUP BY h.id
        `, [id]);
        
        return rows[0] || null;
    } catch (error) {
        console.error('❌ Error obteniendo estado de ocupación:', error);
        throw error;
    }
}
/**
 * Verifica compatibilidad de sexo en habitación compartida
 */
async function verificarCompatibilidadSexo(habitacion_id, sexo_nuevo_paciente) {
    try {
        // Obtener información de la habitación
        const habitacion = await findById(habitacion_id);
        if (!habitacion) {
            return { compatible: false, motivo: 'Habitación no encontrada' };
        }
        // Si es habitación individual, siempre es compatible
        if (habitacion.tipo_habitacion === 'individual') {
            return { compatible: true, motivo: 'Habitación individual' };
        }
        // Para habitaciones compartidas, verificar pacientes actuales
        const [rows] = await pool.query(`
            SELECT DISTINCT p.sexo
            FROM admisiones a
            JOIN pacientes p ON a.paciente_id = p.id
            JOIN camas c ON a.cama_id = c.id
            WHERE c.habitacion_id = ? AND a.estado = 'activa'
        `, [habitacion_id]);
        if (rows.length === 0) {
            return { compatible: true, motivo: 'Habitación vacía' };
        }
        // Verificar si todos los pacientes son del mismo sexo
        const sexosExistentes = rows.map(row => row.sexo);
        const todosMismoSexo = sexosExistentes.every(sexo => sexo === sexo_nuevo_paciente);
        if (todosMismoSexo) {
            return { compatible: true, motivo: 'Compatible con pacientes existentes' };
        } else {
            return { 
                compatible: false, 
                motivo: 'Habitación ocupada por pacientes de sexo diferente' 
            };
        }
    } catch (error) {
        console.error('❌ Error verificando compatibilidad de sexo:', error);
        return { compatible: false, motivo: 'Error verificando compatibilidad' };
    }
}
/**
 * Obtiene estadísticas de habitaciones
 */
async function getEstadisticas() {
    try {
        const [rows] = await pool.query(`
            SELECT 
                COUNT(*) as total_habitaciones,
                SUM(CASE WHEN estado = 'disponible' THEN 1 ELSE 0 END) as habitaciones_disponibles,
                SUM(CASE WHEN estado = 'ocupada' THEN 1 ELSE 0 END) as habitaciones_ocupadas,
                SUM(CASE WHEN estado = 'mantenimiento' THEN 1 ELSE 0 END) as habitaciones_mantenimiento,
                SUM(CASE WHEN tipo_habitacion = 'individual' THEN 1 ELSE 0 END) as individuales,
                SUM(CASE WHEN tipo_habitacion = 'doble' THEN 1 ELSE 0 END) as dobles,
                SUM(CASE WHEN tipo_habitacion = 'multiple' THEN 1 ELSE 0 END) as multiples
            FROM habitaciones 
            WHERE activo = TRUE
        `);
        
        return rows[0] || {
            total_habitaciones: 0,
            habitaciones_disponibles: 0,
            habitaciones_ocupadas: 0,
            habitaciones_mantenimiento: 0,
            individuales: 0,
            dobles: 0,
            multiples: 0
        };
    } catch (error) {
        console.error('❌ Error obteniendo estadísticas de habitaciones:', error);
        return {
            total_habitaciones: 0,
            habitaciones_disponibles: 0,
            habitaciones_ocupadas: 0,
            habitaciones_mantenimiento: 0,
            individuales: 0,
            dobles: 0,
            multiples: 0
        };
    }
}
/**
 * Obtiene reporte de ocupación por ala
 */
async function getReporteOcupacionPorAla() {
    try {
        const [rows] = await pool.query(`
            SELECT 
                a.id as ala_id,
                a.nombre as nombre_ala,
                COUNT(h.id) as total_habitaciones,
                SUM(CASE WHEN h.estado = 'disponible' THEN 1 ELSE 0 END) as habitaciones_disponibles,
                COUNT(c.id) as total_camas,
                SUM(CASE WHEN c.estado = 'ocupada' THEN 1 ELSE 0 END) as camas_ocupadas,
                SUM(CASE WHEN c.estado IN ('libre', 'higienizada') THEN 1 ELSE 0 END) as camas_disponibles,
                ROUND((SUM(CASE WHEN c.estado = 'ocupada' THEN 1 ELSE 0 END) / COUNT(c.id)) * 100, 1) as porcentaje_ocupacion
            FROM alas a
            LEFT JOIN habitaciones h ON a.id = h.ala_id AND h.activo = TRUE
            LEFT JOIN camas c ON h.id = c.habitacion_id AND c.activo = TRUE
            WHERE a.activo = TRUE
            GROUP BY a.id, a.nombre
            ORDER BY a.nombre
        `);
        return rows;
    } catch (error) {
        console.error('❌ Error obteniendo reporte de ocupación por ala:', error);
        throw error;
    }
}
/**
 * Busca habitaciones por número
 */
async function buscarPorNumero(numero) {
    try {
        const [rows] = await pool.query(`
            SELECT 
                h.*,
                a.nombre as nombre_ala,
                COUNT(c.id) as total_camas
            FROM habitaciones h
            LEFT JOIN alas a ON h.ala_id = a.id
            LEFT JOIN camas c ON h.id = c.habitacion_id AND c.activo = TRUE
            WHERE h.numero LIKE ? AND h.activo = TRUE
            GROUP BY h.id
            ORDER BY h.numero
        `, [`%${numero}%`]);
        return rows;
    } catch (error) {
        console.error('❌ Error buscando habitaciones por número:', error);
        throw error;
    }
}
/**
 * Actualiza información de una habitación
 */
async function update(id, datosActualizados) {
    try {
        const campos = [];
        const valores = [];
        // Construir query dinámicamente
        Object.keys(datosActualizados).forEach(campo => {
            if (datosActualizados[campo] !== undefined) {
                campos.push(`${campo} = ?`);
                valores.push(datosActualizados[campo]);
            }
        });
        if (campos.length === 0) {
            return false;
        }
        campos.push('fecha_actualizacion = NOW()');
        valores.push(id);
        const [result] = await pool.query(`
            UPDATE habitaciones 
            SET ${campos.join(', ')}
            WHERE id = ? AND activo = TRUE
        `, valores);
        console.log(`✅ Habitación ${id} actualizada`);
        return result.affectedRows > 0;
    } catch (error) {
        console.error('❌ Error actualizando habitación:', error);
        throw error;
    }
}
module.exports = {
    create,
    findById,
    getAll,
    getDisponibles,
    getByAla,
    updateEstado,
    getEstadoOcupacion,
    verificarCompatibilidadSexo,
    getEstadisticas,
    getReporteOcupacionPorAla,
    buscarPorNumero,
    update
};