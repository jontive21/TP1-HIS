// controllers/admisionController.js
const { pool } = require('../database/connection'); // Importa el pool desde connection.js
const camaService = require('../services/camaService');

// Mostrar formulario de admisión
exports.mostrarFormularioAdmision = async (req, res) => {
  const { id } = req.params;

  try {
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
    req.flash('error', 'Error al cargar el formulario de admisión');
    res.redirect('/dashboard');
  }
};

// Asignar cama al paciente
exports.asignarCama = async (req, res) => {
  const { paciente_id, cama_id, sexo } = req.body;

  // Validar campos obligatorios
  if (!paciente_id || !cama_id || !sexo) {
    req.flash('error', 'Datos incompletos');
    return res.redirect('/admision');
  }

  // Verificar disponibilidad de la cama
  const disponible = await camaService.camaDisponible(cama_id, sexo);

  if (!disponible) {
    req.flash('error', 'La cama no está disponible o no se puede asignar por género');
    return res.redirect(`/admision/${paciente_id}`);
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
    await camaService.asignarCama(conn, cama_id);

    await conn.commit();
    req.flash('success', 'Paciente admitido correctamente');
    res.redirect('/dashboard');

  } catch (err) {
    await conn.rollback();
    console.error('Error al asignar cama:', err.message);
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

  if (!paciente.length || !paciente[0].cama_id) {
    req.flash('error', 'El paciente no tiene cama asignada');
    return res.redirect('/admision');
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Liberar cama
    await conn.query(
      'UPDATE camas SET ocupada = FALSE WHERE id = ?', 
      [paciente[0].cama_id]
    );

    // Actualizar estado del paciente
    await conn.query(
      'UPDATE pacientes SET cama_id = NULL, estado = "cancelado" WHERE id = ?', 
      [paciente_id]
    );

    await conn.commit();
    req.flash('success', 'Admisión cancelada correctamente');
    res.redirect('/dashboard');

  } catch (err) {
    await conn.rollback();
    console.error('Error al cancelar admisión:', err.message);
    req.flash('error', 'No se pudo cancelar la admisión');
    res.redirect('/admision');

  } finally {
    conn.release();
  }
};