const express = require('express');
const router = express.Router();
const Evolucion = require('../models/EvolucionEnfermeria');

// Mostrar historial de evolución
const showEvolucion = async (req, res) => {
    const admisionId = req.params.admisionId;
    const evoluciones = await Evolucion.getEvolucionesByAdmision(admisionId);
    res.render('enfermeria/signos-vitales', { evoluciones });
};

// Procesar nueva evolución
const agregarEvolucion = async (req, res) => {
    const admisionId = req.params.admisionId;
    const usuarioId = req.session.user.id; // Ajusta según tu sistema de sesiones
    const { evolucion } = req.body;
    const fecha = new Date();
    await Evolucion.agregarEvolucion({
        admision_id: admisionId,
        usuario_id: usuarioId,
        fecha,
        evolucion
    });
    res.redirect(`/enfermeria/signos-vitales/${admisionId}`);
};

module.exports = {
    showEvolucion,
    agregarEvolucion
};