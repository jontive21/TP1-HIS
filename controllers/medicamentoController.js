const Medicamento = require('../models/Medicamento');

// Mostrar formulario y lista de medicamentos
exports.showMedicamentos = async (req, res) => {
    const admisionId = req.params.admisionId;
    const medicamentos = await Medicamento.getMedicamentosByAdmision(admisionId);
    res.render('medico/medicamentos', { medicamentos, admisionId });
};

// Prescribir un medicamento
exports.prescribir = async (req, res) => {
    await Medicamento.prescribirMedicamento(req.body);
    res.redirect(`/medico/medicamentos/${req.body.admision_id}`);
};

// Actualizar dosis de un medicamento
exports.actualizarDosis = async (req, res) => {
    await Medicamento.actualizarDosis(req.params.id, req.body.dosis);
    res.redirect('/medico/medicamentos');
};

// Registrar administración
exports.registrarAdministracion = async (req, res) => {
    await Medicamento.registrarAdministracion(req.params.id, new Date(), req.body.efectos);
    res.redirect('back');
};