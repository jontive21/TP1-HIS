const pool = require('../config/db');

// Helper function to execute queries using the pool
async function executeQuery(query, params) {
    const [rows] = await pool.execute(query, params);
    return rows;
}

class BaseModel {
    constructor(tableName) {
        this.tableName = tableName;
    }

    // Encontrar por ID
    async findById(id) {
        const query = `SELECT * FROM ${this.tableName} WHERE id = ?`;
        const results = await executeQuery(query, [id]);
        return results.length > 0 ? results[0] : null;
    }

    // Encontrar todos los registros
    async findAll(conditions = '', params = []) {
        let query = `SELECT * FROM ${this.tableName}`;
        if (conditions) {
            query += ` WHERE ${conditions}`;
        }
        query += ' ORDER BY id DESC';
        return await executeQuery(query, params);
    }

    // Crear nuevo registro
    async create(data) {
        const fields = Object.keys(data);
        const values = Object.values(data);
        const placeholders = fields.map(() => '?').join(', ');
        const query = `INSERT INTO ${this.tableName} (${fields.join(', ')}) VALUES (${placeholders})`;
        const result = await pool.execute(query, values);
        return result[0].insertId;
    }

    // Actualizar registro
    async update(id, data) {
        const fields = Object.keys(data);
        const values = Object.values(data);
        const setClause = fields.map(field => `${field} = ?`).join(', ');
        const query = `UPDATE ${this.tableName} SET ${setClause} WHERE id = ?`;
        return await executeQuery(query, [...values, id]);
    }

    // Eliminar registro (soft delete)
    async delete(id) {
        const query = `UPDATE ${this.tableName} SET activo = false WHERE id = ?`;
        return await executeQuery(query, [id]);
    }

    // Contar registros
    async count(conditions = '', params = []) {
        let query = `SELECT COUNT(*) as total FROM ${this.tableName}`;
        if (conditions) {
            query += ` WHERE ${conditions}`;
        }
        const results = await executeQuery(query, params);
        return results[0].total;
    }
}

module.exports = BaseModel;