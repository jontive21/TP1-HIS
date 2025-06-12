const { pool } = require('../config/db');

class Admision {
    // Crear una nueva admisión
    static async createAdmision(data) {
        const {
            paciente_id,
            cama_id,
            fecha_admision = new Date(),
            fecha_cancelacion = null,
            estado = 'activa'
        } = data;
        const [result] = await pool.query(
            `INSERT INTO admisiones (paciente_id, cama_id, fecha_admision, fecha_cancelacion, estado)
             VALUES (?, ?, ?, ?, ?)`,
            [paciente_id, cama_id, fecha_admision, fecha_cancelacion, estado]
        );
        return result.insertId;
    }

    // Cancelar una admisión (setear fecha_cancelacion y estado)
    static async cancelarAdmision(id) {
        const [result] = await pool.query(
            `UPDATE admisiones SET fecha_cancelacion = NOW(), estado = 'cancelada' WHERE id = ?`,
            [id]
        );
        return result.affectedRows > 0;
    }

    // Obtener admisión por ID (con paciente y cama)
    static async getAdmisionById(id) {
        const [rows] = await pool.query(
            `SELECT a.*, 
                    p.nombre AS paciente_nombre, p.apellido AS paciente_apellido,
                    c.numero AS cama_numero
             FROM admisiones a
             JOIN pacientes p ON a.paciente_id = p.id
             JOIN camas c ON a.cama_id = c.id
             WHERE a.id = ?`,
            [id]
        );
        return rows.length > 0 ? rows[0] : null;
    }

    // Listar admisiones activas
    static async listarAdmisionesActivas() {
        const [rows] = await pool.query(
            `SELECT a.*, 
                    p.nombre AS paciente_nombre, p.apellido AS paciente_apellido,
                    c.numero AS cama_numero
             FROM admisiones a
             JOIN pacientes p ON a.paciente_id = p.id
             JOIN camas c ON a.cama_id = c.id
             WHERE a.estado = 'activa'
             ORDER BY a.id DESC`
        );
        return rows;
    }
}

module.exports = Admision;