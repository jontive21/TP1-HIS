// controllers/admisionController.js
const pool = require('../database/connection');  // Usamos el pool desde database/connection.js

// Mostrar formulario de admisión
exports.mostrarFormularioAdmision = async (req, res) => {
  try {
    const { id } = req.params;

    // Obtener paciente para mostrar nombre
    const [paciente] = await pool.query('SELECT * FROM pacientes WHERE id = ?', [id]);

    // Obtener camas disponibles (limpias y no ocupadas)
    const [camas] = await pool.query(`
      SELECT c.id, h.numero AS habitacion_numero, c.numero AS cama_numero 
      FROM camas c
      JOIN habitaciones h ON c.habitacion_id = h.id
      WHERE c.limpia = TRUE AND c.ocupada = FALSE
    `);

    res.render('admision/formulario', { 
      paciente, 
      camas,
      message: req.flash('error'),
      success: req.flash('success')
    });

  } catch (err) {
    console.error(err);
    req.flash('error', 'Error al cargar el formulario de admisión');
    res.redirect('/dashboard');
  }
};

// Asignar cama al paciente
exports.asignarCama = async (req, res) => {
  const { paciente_id, cama_id, tipo_admision, medico_referente } = req.body;

  // Validar campos obligatorios
  if (!paciente_id || !cama_id) {
    req.flash('error', 'Datos incompletos');
    return res.redirect('/admision');
  }

  // Verificar disponibilidad de la cama
  const [camas] = await pool.query(
    'SELECT * FROM camas WHERE id = ? AND limpia = TRUE AND ocupada = FALSE',
    [cama_id]
  );

  if (!camas.length) {
    req.flash('error', 'La cama seleccionada no está disponible');
    return res.redirect('/admision');
  }

  // Verificar género en habitaciones dobles
  const [paciente] = await pool.query(
    'SELECT sexo FROM pacientes WHERE id = ?', 
    [paciente_id]
  );

  const [cama] = await pool.query(`
    SELECT p.sexo 
    FROM pacientes p
    JOIN camas c ON p.cama_id = c.id
    WHERE c.id = ?
    LIMIT 1`, [cama_id]
  );

  if (cama.length > 0 && cama[0].sexo && cama[0].sexo !== paciente[0].sexo) {
    req.flash('error', 'No se pueden mezclar géneros en habitaciones dobles');
    return res.redirect('/admision');
  }

  // Iniciar transacción
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Actualizar estado del paciente
    await conn.query(
      'UPDATE pacientes SET cama_id = ?, estado = "internado" WHERE id = ?', 
      [cama_id, paciente_id]
    );

    // Marcar cama como ocupada
    await conn.query(
      'UPDATE camas SET ocupada = TRUE WHERE id = ?', 
      [cama_id]
    );

    await conn.commit();
    req.flash('success', 'Paciente admitido correctamente');
    res.redirect('/dashboard');

  } catch (err) {
    await conn.rollback();
    console.error(err);
    req.flash('error', 'Error al asignar cama');
    res.redirect(`/admision/${paciente_id}`);
  } finally {
    conn.release();
  }
};

// Cancelar admisión
exports.cancelarAdmision = async (req, res) => {
  const { paciente_id } = req.body;

  const [paciente] = await pool.query(
    'SELECT cama_id FROM pacientes WHERE id = ?', 
    [paciente_id]
  );

  if (!paciente || !paciente.cama_id) {
    req.flash('error', 'El paciente no tiene cama asignada');
    return res.redirect('/admision');
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Liberar cama
    await conn.query('UPDATE camas SET ocupada = FALSE WHERE id = ?', [paciente.cama_id]);

    // Actualizar estado del paciente
    await conn.query('UPDATE pacientes SET cama_id = NULL, estado = "cancelado" WHERE id = ?', [paciente_id]);

    await conn.commit();
    req.flash('success', 'Admisión cancelada correctamente');
    res.redirect('/dashboard');

  } catch (err) {
    await conn.rollback();
    console.error(err);
    req.flash('error', 'Error al cancelar la admisión');
    res.redirect('/admision');
  } finally {
    conn.release();
  }
};