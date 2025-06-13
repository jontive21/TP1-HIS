// /controllers/enfermeriaController.js
const { pool } = require('../database/connection');

exports.mostrarFormularioEvaluacion = async (req, res) => {
  const { id } = req.params;
  const [paciente] = await pool.query('SELECT * FROM pacientes WHERE id = ?', [id]);
  res.render('enfermeria/evaluacion', { paciente });
};

exports.registrarEvaluacion = async (req, res) => {
  const { paciente_id, presion, temperatura, frecuencia, motivo, sintomas } = req.body;

  if (!presion || !temperatura || !frecuencia) {
    req.flash('error', 'Los signos vitales son obligatorios');
    return res.redirect(`/enfermeria/evaluar/${paciente_id}`);
  }

  try {
    await pool.query('INSERT INTO signos_vitales SET ?', {
      paciente_id,
      presion,
      temperatura,
      frecuencia_cardiaca: frecuencia,
      motivo_internacion: motivo,
      sintomas
    });

    req.flash('success', 'Evaluación registrada');
    res.redirect('/dashboard');

  } catch (error) {
    console.error(error);
    req.flash('error', 'Error al registrar evaluación');
    res.redirect(`/enfermeria/evaluar/${paciente_id}`);
  }
};