// /controllers/medicoController.js
const { pool } = require('../database/connection');

exports.mostrarFormularioDiagnostico = async (req, res) => {
  const { id } = req.params;
  const [paciente] = await pool.query('SELECT * FROM pacientes WHERE id = ?', [id]);
  res.render('medico/diagnostico', { paciente });
};

exports.registrarDiagnostico = async (req, res) => {
  const { paciente_id, diagnostico, tratamiento, observaciones } = req.body;

  if (!diagnostico) {
    req.flash('error', 'El diagnóstico es obligatorio');
    return res.redirect(`/medico/diagnostico/${paciente_id}`);
  }

  try {
    await pool.query('INSERT INTO diagnosticos SET ?', {
      paciente_id,
      diagnostico,
      tratamiento,
      observaciones
    });

    req.flash('success', 'Diagnóstico registrado correctamente');
    res.redirect('/dashboard');

  } catch (error) {
    console.error(error);
    req.flash('error', 'Error al registrar diagnóstico');
    res.redirect(`/medico/diagnostico/${paciente_id}`);
  }
};