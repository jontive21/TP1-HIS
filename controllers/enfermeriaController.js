const pool = require('../database/connection');
// Mostrar formulario de evaluación
exports.mostrarFormularioEvaluacion = async (req, res) => {
  const { id } = req.params;
  const [paciente] = await pool.query('SELECT * FROM pacientes WHERE id = ?', [id]);
  res.render('enfermeria/evaluacion', { paciente, message: req.flash('error') });
};

// Registrar evaluación
exports.registrarEvaluacion = async (req, res) => {
  const { paciente_id, presion, temperatura, frecuencia, motivo, sintomas } = req.body;

  if (!presion || !temperatura || !frecuencia) {
    req.flash('error', 'Los signos vitales son obligatorios');
    return res.redirect(`/enfermeria/evaluar/${paciente_id}`);
  }

  try {
    await pool.query(
      'INSERT INTO signos_vitales SET ?', 
      {
        paciente_id,
        presion,
        temperatura,
        frecuencia_cardiaca: frecuencia,
        motivo_internacion: motivo,
        sintomas
      }
    );
    req.flash('success', 'Evaluación registrada correctamente');
    res.redirect('/dashboard');
  } catch (error) {
    console.error(error);
    req.flash('error', 'Error al registrar la evaluación');
    res.redirect(`/enfermeria/evaluar/${paciente_id}`);
  }
};