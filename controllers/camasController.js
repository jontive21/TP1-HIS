const asignarCama = async (req, res) => {
  const { pacienteId, camaId } = req.body;
  try {
    // Obtener paciente y cama
    const paciente = await Paciente.findByPk(pacienteId);
    const cama = await Cama.findByPk(camaId, {
      include: [{ model: Habitacion, include: [Cama] }]
    });

    // Validar regla de sexo opuesto
    const otrasCamas = cama.Habitacion.Camas.filter(c => c.id !== camaId);
    for (const otraCama of otrasCamas) {
      if (otraCama.ocupada) {
        const admision = await Admision.findOne({ 
          where: { cama_id: otraCama.id, fecha_cancelacion: null },
          include: [Paciente]
        });
        if (admision && admision.Paciente.sexo !== paciente.sexo) {
          req.flash('error', 'No se puede asignar: paciente de sexo opuesto en la misma habitación');
          return res.redirect('/camas');
        }
      }
    }

    // Crear admisión
    await Admision.create({ paciente_id: pacienteId, cama_id: camaId });
    req.flash('success', 'Cama asignada correctamente');
    res.redirect('/pacientes');
  } catch (error) {
    res.status(500).send(error.message);
  }
};