async function asignarCama(req, res) {
  const { paciente_id, tipo_habitacion, sexo } = req.body;

  // Buscar cama disponible, limpia y compatible con género
  const cama = await pool.query(`
    SELECT c.id 
    FROM camas c
    JOIN habitaciones h ON c.habitacion_id = h.id
    WHERE c.limpia = TRUE AND c.ocupada = FALSE
      AND NOT EXISTS (
        SELECT 1 FROM pacientes p 
        WHERE p.cama_id = c.id AND p.sexo != ?
      )
      AND h.tipo = ?
    LIMIT 1`, [sexo, tipo_habitacion]);

  if (!cama.length) {
    req.flash('error', 'No hay camas disponibles');
    return res.redirect('/admision');
  }

  // Usar transacción para evitar conflictos
  await pool.beginTransaction();
  try {
    await pool.query('UPDATE pacientes SET cama_id = ?, estado = "internado" WHERE id = ?', [cama[0].id, paciente_id]);
    await pool.query('UPDATE camas SET ocupada = TRUE WHERE id = ?', [cama[0].id]);
    await pool.commit();
    req.flash('success', 'Cama asignada exitosamente');
    res.redirect('/dashboard');
  } catch (error) {
    await pool.rollback();
    req.flash('error', 'Error al asignar cama');
    res.redirect('/admision');
  }
}
async function cancelarAdmision(req, res) {
  const { paciente_id } = req.body;

  const [paciente] = await pool.query('SELECT cama_id FROM pacientes WHERE id = ?', [paciente_id]);

  if (!paciente || !paciente.cama_id) {
    req.flash('error', 'El paciente no tiene cama asignada');
    return res.redirect('/admision');
  }

  await pool.beginTransaction();
  try {
    await pool.query('UPDATE camas SET ocupada = FALSE WHERE id = ?', [paciente.cama_id]);
    await pool.query('UPDATE pacientes SET cama_id = NULL, estado = "cancelado" WHERE id = ?', [paciente_id]);
    await pool.commit();
    req.flash('success', 'Admisión cancelada correctamente');
    res.redirect('/dashboard');
  } catch (error) {
    await pool.rollback();
    req.flash('error', 'Error al cancelar la admisión');
    res.redirect('/admision');
  }
}