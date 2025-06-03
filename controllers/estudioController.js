const Estudio = require('../models/Estudio');

// Mostrar formulario y lista de estudios
exports.showEstudios = async (req, res) => {
    const admisionId = req.params.admisionId;
    const estudios = await Estudio.getEstudiosByAdmision(admisionId);
    res.render('medico/estudios', { estudios, admisionId });
};

// Procesar solicitud de estudio
exports.solicitarEstudio = async (req, res) => {
    const admisionId = req.params.admisionId;
    const { estudio, observaciones } = req.body;
    await Estudio.crearEstudio({ admision_id: admisionId, estudio, observaciones });
    res.redirect(`/medico/estudios/${admisionId}`);
};