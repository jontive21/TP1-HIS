exports.showDashboard = (req, res) => {
    res.render('dashboard/index', {
        title: 'Dashboard - HIS Internación',
        user: req.session.user,
        camasDisponibles: 12,
        camasTotal: 20,
        pacientesInternados: 8,
        admisionesHoy: 3,
        altasHoy: 2,
        lastAccess: new Date().toLocaleDateString('es-AR')
    });
};