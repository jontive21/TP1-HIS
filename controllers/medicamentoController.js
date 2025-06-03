const Medicamento = require('../models/Medicamento');

// Mostrar formulario y lista de medicamentos
exports.showMedicamentos = async (req, res) => {
    const admisionId = req.params.admisionId;
    const medicamentos = await Medicamento.getMedicamentosByAdmision(admisionId);
    res.render('medico/medicamentos', { medicamentos, admisionId });
};

// Prescribir un medicamento
exports.prescribir = async (req, res) => {
    const admisionId = req.params.admisionId;
    await Medicamento.prescribirMedicamento({ ...req.body, admision_id: admisionId });
    res.redirect(`/medico/medicamentos/${admisionId}`);
};

// Registrar administración
exports.registrarAdministracion = async (req, res) => {
    const admisionId = req.params.admisionId;
    await Medicamento.registrarAdministracion(req.params.id, new Date());
    res.redirect(`/medico/medicamentos/${admisionId}`);
};