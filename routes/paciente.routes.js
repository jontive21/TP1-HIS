// Rutas simples de pacientes
const express = require('express');
const router = express.Router();
const db = require('../config/db');
// Lista de pacientes
router.get('/', async (req, res) => {
    try {
        const [pacientes] = await db.query(`
            SELECT id, dni, nombre, apellido, fecha_nacimiento, sexo, telefono, obra_social
            FROM pacientes
            ORDER BY apellido, nombre
            LIMIT 50
        `);
        res.render('pacientes/index', {
            title: 'Lista de Pacientes',
            pacientes: pacientes
        });
    } catch (error) {
        console.error('Error:', error);
        res.render('pacientes/index', {
            title: 'Lista de Pacientes',
            pacientes: [],
            error: 'Error al cargar pacientes'
        });
    }
});
// Ver detalles de un paciente
router.get('/:id', async (req, res) => {
    try {
        const [paciente] = await db.query('SELECT * FROM pacientes WHERE id = ?', [req.params.id]);
        
        if (paciente.length === 0) {
            return res.redirect('/pacientes?error=Paciente no encontrado');
        }
        // Obtener admisiones del paciente
        const [admisiones] = await db.query(`
            SELECT a.*, h.numero as habitacion, c.numero as cama
            FROM admisiones a
            JOIN camas c ON a.cama_id = c.id
            JOIN habitaciones h ON c.habitacion_id = h.id
            WHERE a.paciente_id = ?
            ORDER BY a.fecha_admision DESC
        `, [req.params.id]);
        res.render('pacientes/detalle', {
            title: `${paciente[0].nombre} ${paciente[0].apellido}`,
            paciente: paciente[0],
            admisiones: admisiones
        });
    } catch (error) {
        console.error('Error:', error);
        res.redirect('/pacientes?error=Error al cargar paciente');
    }
});
module.exports = router;