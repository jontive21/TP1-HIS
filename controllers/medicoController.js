const pool = require('../database');

// Mostrar formulario de diagnóstico
exports.mostrarFormularioDiagnostico = async (req, res) => {
  const { id } = req.params;
  const [paciente] = await pool.query('SELECT * FROM pacientes WHERE id = ?', [id]);
  res.render('medico/diagnostico', { paciente, message: req.flash('error') });
};

// Registrar diagnóstico
exports.registrarDiagnostico = async (req, res) => {
  const { paciente_id, diagnostico, tratamiento, observaciones } = req.body;

  if (!diagnostico) {
    req.flash('error', 'El diagnóstico es obligatorio');
    return res.redirect(`/medico/diagnostico/${paciente_id}`);
  }

  try {
    await pool.query(
      'INSERT INTO diagnosticos SET ?', 
      {
        paciente_id,
        diagnostico,
        tratamiento,
        observaciones
      }
    );
    req.flash('success', 'Diagnóstico registrado correctamente');
    res.redirect('/dashboard');
  } catch (error) {
    console.error(error);
    req.flash('error', 'Error al registrar el diagnóstico');
    res.redirect(`/medico/diagnostico/${paciente_id}`);
  }
};
// Mostrar formulario de alta
exports.mostrarFormularioAlta = async (req, res) => {
  const { id } = req.params;
  const [paciente] = await pool.query('SELECT * FROM pacientes WHERE id = ?', [id]);
  res.render('medico/alta', { paciente, message: req.flash('error') });
};

// Registrar alta hospitalaria
exports.registrarAlta = async (req, res) => {
  const { paciente_id, motivo_alta, instrucciones } = req.body;

  if (!motivo_alta || !instrucciones) {
    req.flash('error', 'El motivo y las instrucciones son obligatorias');
    return res.redirect(`/medico/alta/${paciente_id}`);
  }

  const [paciente] = await pool.query('SELECT cama_id FROM pacientes WHERE id = ?', [paciente_id]);

  try {
    // Usar transacción para mantener consistencia
    await pool.beginTransaction();

    // Liberar cama
    if (paciente.cama_id) {
      await pool.query('UPDATE camas SET ocupada = FALSE WHERE id = ?', [paciente.cama_id]);
    }

    // Dar de alta al paciente
    await pool.query(
      'UPDATE pacientes SET estado = "alta", cama_id = NULL WHERE id = ?', 
      [paciente_id]
    );

    // Registrar detalles del alta (opcionalmente crear tabla `altas`)
    await pool.query(
      'INSERT INTO altas SET ?',
      {
        paciente_id,
        motivo_alta,
        instrucciones,
        fecha_alta: new Date()
      }
    );

    await pool.commit();
    req.flash('success', 'Paciente dado de alta correctamente');
    res.redirect('/dashboard');

  } catch (error) {
    await pool.rollback();
    console.error(error);
    req.flash('error', 'Error al dar de alta al paciente');
    res.redirect(`/medico/alta/${paciente_id}`);
  }
};