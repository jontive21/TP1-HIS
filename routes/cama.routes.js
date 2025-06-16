// Rutas simples de camas
const express = require('express');
const router = express.Router();
const db = require('../config/db');
// Lista de camas
router.get('/', async (req, res) => {
    try {
        const [camas] = await db.query(`
            SELECT c.id, c.numero as cama_numero, c.estado, c.higienizada, c.sexo_ocupante,
                   h.numero as habitacion_numero, h.ala,
                   CASE 
                       WHEN c.estado = 'ocupada' THEN (
                           SELECT CONCAT(p.nombre, ' ', p.apellido)
                           FROM admisiones a
                           JOIN pacientes p ON a.paciente_id = p.id
                           WHERE a.cama_id = c.id AND a.estado = 'activa'
                           LIMIT 1
                       )
                       ELSE NULL
                   END as paciente
            FROM camas c
            JOIN habitaciones h ON c.habitacion_id = h.id
            ORDER BY h.numero, c.numero
        `);
        res.render('camas/index', {
            title: 'Estado de Camas',
            camas: camas
        });
    } catch (error) {
        console.error('Error:', error);
        res.render('camas/index', {
            title: 'Estado de Camas',
            camas: [],
            error: 'Error al cargar camas'
        });
    }
});
module.exports = router;