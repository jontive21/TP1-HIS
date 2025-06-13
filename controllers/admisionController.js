// controllers/admisionController.js
const { pool } = require('../database/connection');

// Mostrar formulario de admisión
exports.mostrarFormularioAdmision = async (req, res) => {
  const { id } = req.params;

  try {
    // Obtener paciente y camas disponibles
    const [paciente] = await pool.query('SELECT * FROM pacientes WHERE id = ?', [id]);
    const [camas] = await pool.query(`
      SELECT c.id, h.numero AS habitacion_numero, c.numero AS cama_numero 
      FROM camas c
      JOIN habitaciones h ON c.habitacion_id = h.id
      WHERE c.limpia = TRUE AND c.ocupada = FALSE
    `);

    res.render('admision/formulario', {
      paciente: paciente[0],
      camas,
      message: req.flash('error'),
      success: req.flash('success')
    });

  } catch (err) {
    console.error('Error al cargar formulario de admisión:', err.message);
    req.flash('error', 'No se pudo cargar el formulario de admisión');
    res.redirect('/dashboard');
  }
};

// Asignar cama al paciente
exports.asignarCama = async (req, res) => {
  const { paciente_id, cama_id, sexo } = req.body;

  if (!paciente_id || !cama_id) {
    req.flash('error', 'Datos incompletos');
    return res.redirect('/admision');
  }

  try {
    await pool.query(
      'UPDATE pacientes SET cama_id = ?, estado = "internado" WHERE id = ?',
      [cama_id, paciente_id]
    );

    await pool.query('UPDATE camas SET ocupada = TRUE WHERE id = ?', [cama_id]);

    req.flash('success', 'Paciente admitido correctamente');
    res.redirect('/dashboard');

  } catch (err) {
    console.error('Error al asignar cama:', err.message);
    req.flash('error', 'Error al asignar cama');
    res.redirect(`/admision/${paciente_id}`);
  }
};

// Cancelar admisión
exports.cancelarAdmision = async (req, res) => {
  const { paciente_id } = req.body;

  try {
    const [paciente] = await pool.query('SELECT cama_id FROM pacientes WHERE id = ?', [paciente_id]);

    if (!paciente.length || !paciente[0].cama_id) {
      req.flash('error', 'El paciente no tiene cama asignada');
      return res.redirect('/admision');
    }

    await pool.query('UPDATE camas SET ocupada = FALSE WHERE id = ?', [paciente.cama_id]);
    await pool.query('UPDATE pacientes SET cama_id = NULL, estado = "cancelado" WHERE id = ?', [paciente_id]);

    req.flash('success', 'Admisión cancelada correctamente');
    res.redirect('/dashboard');

  } catch (err) {
    console.error('Error al cancelar admisión:', err.message);
    req.flash('error', 'No se pudo cancelar la admisión');
    res.redirect('/admision');
  }
};