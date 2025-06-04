const pool = require('../config/db');

// Reporte de ocupación (por ala y general)
exports.reporteOcupacion = async (req, res) => {
    // Ocupación por ala
    const [ocupacionPorAla] = await pool.query(`
        SELECT 
            a.nombre AS ala,
            COUNT(c.id) AS total_camas,
            SUM(c.estado = 'ocupada') AS camas_ocupadas,
            SUM(c.estado = 'libre') AS camas_libres
        FROM alas a
        JOIN habitaciones h ON h.ala_id = a.id
        JOIN camas c ON c.habitacion_id = h.id
        GROUP BY a.id
    `);

    // Ocupación general
    const [ocupacionGeneral] = await pool.query(`
        SELECT 
            COUNT(*) AS total_camas,
            SUM(estado = 'ocupada') AS camas_ocupadas,
            SUM(estado = 'libre') AS camas_libres
        FROM camas
    `);

    res.render('reportes/ocupacion', { ocupacionPorAla, ocupacionGeneral: ocupacionGeneral[0] });
};

// Reporte de pacientes internados actualmente
exports.reportePacientesInternados = async (req, res) => {
    const [pacientes] = await pool.query(`
        SELECT 
            p.dni, p.nombre, p.apellido, p.sexo, ad.fecha_admision,
            c.numero AS cama, h.numero AS habitacion, al.nombre AS ala
        FROM pacientes p
        JOIN admisiones ad ON p.id = ad.paciente_id
        JOIN camas c ON ad.cama_id = c.id
        JOIN habitaciones h ON c.habitacion_id = h.id
        JOIN alas al ON h.ala_id = al.id
        WHERE ad.estado = 'activa'
        ORDER BY al.nombre, h.numero, c.numero
    `);
    res.render('reportes/pacientes_internados', { pacientes });
};

// Reporte de altas del día
exports.reporteAltasDelDia = async (req, res) => {
    const [altas] = await pool.query(`
        SELECT 
            a.id, a.fecha_alta, a.tipo_alta, p.dni, p.nombre, p.apellido, ad.motivo_internacion
        FROM altas a
        JOIN admisiones ad ON a.admision_id = ad.id
        JOIN pacientes p ON ad.paciente_id = p.id
        WHERE DATE(a.fecha_alta) = CURDATE()
        ORDER BY a.fecha_alta DESC
    `);
    res.render('reportes/altas_del_dia', { altas });
};

// Reporte de estadísticas generales
exports.reporteEstadisticas = async (req, res) => {
    // Ejemplo: cantidad de pacientes internados, altas, cancelaciones, ocupación
    const [[{ internados }]] = await pool.query(`SELECT COUNT(*) AS internados FROM admisiones WHERE estado = 'activa'`);
    const [[{ altas }]] = await pool.query(`SELECT COUNT(*) AS altas FROM admisiones WHERE estado = 'alta'`);
    const [[{ canceladas }]] = await pool.query(`SELECT COUNT(*) AS canceladas FROM admisiones WHERE estado = 'cancelada'`);
    const [[{ camas_ocupadas }]] = await pool.query(`SELECT COUNT(*) AS camas_ocupadas FROM camas WHERE estado = 'ocupada'`);
    const [[{ camas_libres }]] = await pool.query(`SELECT COUNT(*) AS camas_libres FROM camas WHERE estado = 'libre'`);

    res.render('reportes/estadisticas', {
        internados,
        altas,
        canceladas,
        camas_ocupadas,
        camas_libres
    });
};