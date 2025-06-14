// controllers/admisionController.js
const { pool } = require('../database/connection');

// Mostrar formulario de admisión
exports.showNuevaAdmision = async (req, res) => {
  const { id } = req.params;

  try {
    const [pacientes] = await pool.query('SELECT * FROM pacientes ORDER BY apellido, nombre');
    const [camas] = await pool.query(`
      SELECT c.id, h.numero AS habitacion_numero, c.numero AS cama_numero 
      FROM camas c
      JOIN habitaciones h ON c.habitacion_id = h.id
      WHERE c.limpia = TRUE AND c.ocupada = FALSE
    `);

    res.render('admisiones/crear', { pacientes, camas });

  } catch (err) {
    console.error('Error al cargar formulario:', err.message);
    req.session.error = 'No se pudo cargar el formulario de admisión';
    res.redirect('/');
  }
};

// Asignar cama al paciente
exports.asignarCama = async (req, res) => {
  const { paciente_id, cama_id, sexo } = req.body;

  if (!paciente_id || !cama_id) {
    req.session.error = 'Datos incompletos';
    return res.redirect('/admisiones/crear');
  }

  try {
    // Validar disponibilidad de cama
    const [camas] = await pool.query(
      'SELECT * FROM camas WHERE id = ? AND limpia = TRUE AND ocupada = FALSE',
      [cama_id]
    );

    if (!camas.length) {
      req.session.error = 'La cama seleccionada no está disponible.';
      return res.redirect('/admisiones/crear');
    }

    // Validar género en habitación doble
    const [paciente] = await pool.query(`
      SELECT p.sexo 
      FROM pacientes p
      JOIN camas c ON p.cama_id = c.id
      WHERE c.id = ?
      LIMIT 1`, [cama_id]
    );

    if (paciente.length > 0 && paciente[0].sexo !== sexo) {
      req.session.error = 'No se pueden mezclar géneros en habitaciones dobles';
      return res.redirect(`/admisiones/${paciente_id}`);
    }

    // Actualizar estado del paciente
    await pool.query(
      'UPDATE pacientes SET cama_id = ?, estado = "internado" WHERE id = ?', 
      [cama_id, paciente_id]
    );

    // Marcar cama como ocupada
    await pool.query('UPDATE camas SET ocupada = TRUE WHERE id = ?', [cama_id]);

    req.session.success = 'Paciente admitido correctamente';
    res.redirect('/dashboard');

  } catch (err) {
    console.error('Error al asignar cama:', err.message);
    req.session.error = 'No se pudo asignar la cama';
    res.redirect(`/admisiones/${req.body.paciente_id}`);

  } finally {
    pool.release();
  }
};