const { pool } = require('../config/db');

// Prescribir un medicamento
async function prescribirMedicamento(data) {
    const { admision_id, nombre, dosis, frecuencia, via, observaciones } = data;
    const [result] = await pool.query(
        `INSERT INTO medicamentos_prescritos (admision_id, nombre, dosis, frecuencia, via, observaciones)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [admision_id, nombre, dosis, frecuencia, via, observaciones]
    );
    return result.insertId;
}

// Obtener medicamentos por admisión
async function getMedicamentosByAdmision(admisionId) {
    const [rows] = await pool.query(
        `SELECT * FROM medicamentos_prescritos WHERE admision_id = ? ORDER BY id DESC`,
        [admisionId]
    );
    return rows;
}

// Registrar administración
async function registrarAdministracion(medicamentoId, fecha, efectos = null) {
    const [result] = await pool.query(
        `INSERT INTO administracion_medicamentos (medicamento_id, fecha_administracion, efectos)
         VALUES (?, ?, ?)`,
        [medicamentoId, fecha, efectos]
    );
    return result.insertId;
}

module.exports = {
    prescribirMedicamento,
    getMedicamentosByAdmision,
    registrarAdministracion
};