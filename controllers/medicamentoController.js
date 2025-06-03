const Medicamento = require('../models/Medicamento');

exports.prescribir = async (req, res) => {
    await Medicamento.prescribirMedicamento(req.body);
    res.redirect('/medico/medicamentos');
};

exports.actualizarDosis = async (req, res) => {
    await Medicamento.actualizarDosis(req.params.id, req.body.dosis);
    res.redirect('/medico/medicamentos');
};

exports.registrarAdministracion = async (req, res) => {
    await Medicamento.registrarAdministracion(req.params.id, new Date(), req.body.efectos);
    res.redirect('/medico/medicamentos');
};