const BaseModel = require('./BaseModel');
const pool = require('../config/db');

// Helper function to execute queries using the pool
async function executeQuery(query, params) {
    const [rows] = await pool.execute(query, params);
    return rows;
}

class Paciente extends BaseModel {
    constructor() {
        super('pacientes');
    }

    // Buscar paciente por DNI
    async findByDni(dni) {
        const query = 'SELECT * FROM pacientes WHERE dni = ? AND activo = true';
        const results = await executeQuery(query, [dni]);
        return results.length > 0 ? results[0] : null;
    }

    // Buscar pacientes por nombre/apellido
    async searchByName(searchTerm) {
        const query = `
            SELECT * FROM pacientes 
            WHERE (nombre LIKE ? OR apellido LIKE ? OR CONCAT(nombre, ' ', apellido) LIKE ?) 
            AND activo = true 
            ORDER BY apellido, nombre
        `;
        const searchPattern = `%${searchTerm}%`;
        return await executeQuery(query, [searchPattern, searchPattern, searchPattern]);
    }

    // Obtener pacientes con información de internación actual
    async getPacientesConInternacion() {
        const query = `
            SELECT 
                p.*,
                a.id as admision_id,
                a.fecha_admision,
                a.motivo_internacion,
                a.estado as estado_admision,
                c.numero as cama_numero,
                h.numero as habitacion_numero,
                al.nombre as ala_nombre
            FROM pacientes p
            LEFT JOIN admisiones a ON p.id = a.paciente_id AND a.estado = 'activa'
            LEFT JOIN camas c ON a.cama_id = c.id
            LEFT JOIN habitaciones h ON c.habitacion_id = h.id
            LEFT JOIN alas al ON h.ala_id = al.id
            WHERE p.activo = true
            ORDER BY p.apellido, p.nombre
        `;
        return await executeQuery(query);
    }

    // Validar que el paciente no tenga internación activa
    async tieneInternacionActiva(pacienteId) {
        const query = 'SELECT COUNT(*) as count FROM admisiones WHERE paciente_id = ? AND estado = "activa"';
        const results = await executeQuery(query, [pacienteId]);
        return results[0].count > 0;
    }

    // Obtener edad del paciente
    static calcularEdad(fechaNacimiento) {
        const hoy = new Date();
        const nacimiento = new Date(fechaNacimiento);
        let edad = hoy.getFullYear() - nacimiento.getFullYear();
        const mes = hoy.getMonth() - nacimiento.getMonth();
        
        if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
            edad--;
        }
        
        return edad;
    }

    // Buscar pacientes por nombre, apellido o DNI
    static async searchPacientes(searchTerm) {
        const searchPattern = `%${searchTerm}%`;
        const [rows] = await pool.query(
            `SELECT * FROM pacientes 
             WHERE (nombre LIKE ? OR apellido LIKE ? OR dni LIKE ?) 
             AND activo = TRUE
             ORDER BY apellido, nombre`,
            [searchPattern, searchPattern, searchPattern]
        );
        return rows;
    }

    // Crear un nuevo paciente
    static async createPaciente(data) {
        const {
            nombre, apellido, dni, fecha_nacimiento, sexo, telefono, direccion, email,
            alergias, medicamentos_actuales, antecedentes_familiares, presion_arterial, frecuencia_cardiaca, temperatura
        } = data;
        const [result] = await pool.query(
            `INSERT INTO pacientes 
            (nombre, apellido, dni, fecha_nacimiento, sexo, telefono, direccion, email, alergias, medicamentos_actuales, antecedentes_familiares, presion_arterial, frecuencia_cardiaca, temperatura) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [nombre, apellido, dni, fecha_nacimiento, sexo, telefono, direccion, email, alergias, medicamentos_actuales, antecedentes_familiares, presion_arterial, frecuencia_cardiaca, temperatura]
        );
        return result.insertId;
    }

    // Actualizar paciente existente
    static async updatePaciente(id, data) {
        const fields = [];
        const values = [];
        // Solo actualiza los campos que estén presentes en data
        const allowedFields = [
            'nombre', 'apellido', 'dni', 'fecha_nacimiento', 'sexo', 'telefono', 'direccion', 'email',
            'alergias', 'medicamentos_actuales', 'antecedentes_familiares', 'presion_arterial', 'frecuencia_cardiaca', 'temperatura'
        ];
        for (const key of allowedFields) {
            if (data[key] !== undefined) {
                fields.push(`${key} = ?`);
                values.push(data[key]);
            }
        }
        values.push(id);
        const [result] = await pool.query(
            `UPDATE pacientes SET ${fields.join(', ')} WHERE id = ?`,
            values
        );
        return result.affectedRows > 0;
    }

    // Validar si el DNI ya existe
    static async validateDNI(dni) {
        const [rows] = await pool.query(
            `SELECT id FROM pacientes WHERE dni = ? AND activo = TRUE`,
            [dni]
        );
        return rows.length > 0;
    }
}

module.exports = new Paciente();