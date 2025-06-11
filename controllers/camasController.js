const { pool } = require('../config/db');

const asignarCama = async (req, res) => {
  try {
    const { pacienteId, camaId } = req.body;

    // Obtener sexo del paciente
    const [[paciente]] = await pool.query(
      'SELECT sexo FROM pacientes WHERE id = ?', [pacienteId]
    );
    if (!paciente) {
      req.flash('error', 'Paciente no encontrado');
      return res.redirect('/camas');
    }

    // Obtener datos de la cama y habitación
    const [[cama]] = await pool.query(
      `SELECT c.id, h.id AS habitacion_id, h.tipo 
       FROM camas c 
       JOIN habitaciones h ON c.habitacion_id = h.id 
       WHERE c.id = ?`, [camaId]
    );
    if (!cama) {
      req.flash('error', 'Cama no encontrada');
      return res.redirect('/camas');
    }

    // Si la habitación es compartida, validar sexo de otros pacientes en camas ocupadas
    if (cama.tipo === 'compartida') {
      const [otrasCamas] = await pool.query(
        `SELECT p.sexo 
         FROM camas c
         JOIN admisiones a ON a.cama_id = c.id AND a.fecha_cancelacion IS NULL
         JOIN pacientes p ON a.paciente_id = p.id
         WHERE c.habitacion_id = ? AND c.id <> ?`,
        [cama.habitacion_id, camaId]
      );
      if (otrasCamas.some(oc => oc.sexo !== paciente.sexo)) {
        req.flash('error', 'No se puede asignar a paciente de sexo opuesto en habitación compartida');
        return res.redirect('/camas');
      }
    }

    // Crear admisión
    await pool.query(
      `INSERT INTO admisiones (paciente_id, cama_id, fecha_ingreso) VALUES (?, ?, NOW())`,
      [pacienteId, camaId]
    );
    // Marcar cama como ocupada
    await pool.query(
      `UPDATE camas SET ocupada = TRUE WHERE id = ?`,
      [camaId]
    );

    req.flash('success', 'Paciente admitido correctamente');
    res.redirect('/pacientes');
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = { asignarCama };