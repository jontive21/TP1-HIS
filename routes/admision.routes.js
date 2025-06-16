// Rutas simples de admisión
const express = require('express');
const router = express.Router();
const db = require('../config/db');
// Página principal de admisiones - ENDPOINT PRINCIPAL
router.get('/', async (req, res) => {
    try {
        // Obtener lista de admisiones
        const [admisiones] = await db.query(`
            SELECT a.id, a.fecha_admision, a.motivo_internacion, a.estado,
                   p.nombre, p.apellido, p.dni,
                   h.numero as habitacion, c.numero as cama
            FROM admisiones a
            JOIN pacientes p ON a.paciente_id = p.id
            JOIN camas c ON a.cama_id = c.id
            JOIN habitaciones h ON c.habitacion_id = h.id
            ORDER BY a.fecha_admision DESC
            LIMIT 20
        `);
        res.render('admisiones/index', {
            title: 'Lista de Admisiones',
            admisiones: admisiones
        });
    } catch (error) {
        console.error('Error:', error);
        res.render('admisiones/index', {
            title: 'Lista de Admisiones',
            admisiones: [],
            error: 'Error al cargar admisiones'
        });
    }
});
// Formulario nueva admisión
router.get('/nueva', async (req, res) => {
    try {
        // Obtener camas disponibles
        const [camas] = await db.query(`
            SELECT c.id, c.numero as cama_numero, h.numero as habitacion_numero, h.ala
            FROM camas c
            JOIN habitaciones h ON c.habitacion_id = h.id
            WHERE c.estado = 'libre' AND c.higienizada = true
            ORDER BY h.numero, c.numero
        `);
        res.render('admisiones/nueva', {
            title: 'Nueva Admisión',
            camas: camas
        });
    } catch (error) {
        console.error('Error:', error);
        res.render('admisiones/nueva', {
            title: 'Nueva Admisión',
            camas: [],
            error: 'Error al cargar formulario'
        });
    }
});
// Crear nueva admisión
router.post('/crear', async (req, res) => {
    try {
        const {
            // Datos del paciente
            dni, nombre, apellido, fecha_nacimiento, sexo, direccion, telefono, email,
            contacto_emergencia_nombre, contacto_emergencia_telefono, contacto_emergencia_relacion,
            obra_social, numero_afiliado, alergias, medicamentos,
            // Datos de admisión
            motivo_internacion, medico_derivante, cama_id, desde_guardia
        } = req.body;
        // 1. Crear o buscar paciente
        let pacienteId;
        
        // Buscar si ya existe
        const [pacienteExistente] = await db.query('SELECT id FROM pacientes WHERE dni = ?', [dni]);
        
        if (pacienteExistente.length > 0) {
            // Paciente existe, usar su ID
            pacienteId = pacienteExistente[0].id;
        } else {
            // Crear nuevo paciente
            const [resultPaciente] = await db.query(`
                INSERT INTO pacientes (
                    dni, nombre, apellido, fecha_nacimiento, sexo, direccion, telefono, email,
                    contacto_emergencia_nombre, contacto_emergencia_telefono, contacto_emergencia_relacion,
                    obra_social, numero_afiliado, alergias, medicamentos
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                dni, nombre, apellido, fecha_nacimiento, sexo, direccion, telefono, email,
                contacto_emergencia_nombre, contacto_emergencia_telefono, contacto_emergencia_relacion,
                obra_social, numero_afiliado, alergias, medicamentos
            ]);
            pacienteId = resultPaciente.insertId;
        }
        // 2. Crear admisión
        await db.query(`
            INSERT INTO admisiones (paciente_id, cama_id, motivo_internacion, medico_derivante, desde_guardia)
            VALUES (?, ?, ?, ?, ?)
        `, [pacienteId, cama_id, motivo_internacion, medico_derivante, desde_guardia || false]);
        // 3. Actualizar estado de la cama
        await db.query(`
            UPDATE camas SET estado = 'ocupada', sexo_ocupante = ? WHERE id = ?
        `, [sexo, cama_id]);
        res.redirect('/admisiones?success=Admisión creada correctamente');
    } catch (error) {
        console.error('Error al crear admisión:', error);
        res.redirect('/admisiones/nueva?error=Error al crear admisión');
    }
});
// Buscar paciente por DNI (AJAX)
router.get('/buscar-paciente/:dni', async (req, res) => {
    try {
        const [paciente] = await db.query('SELECT * FROM pacientes WHERE dni = ?', [req.params.dni]);
        
        if (paciente.length > 0) {
            res.json({ encontrado: true, paciente: paciente[0] });
        } else {
            res.json({ encontrado: false });
        }
    } catch (error) {
        res.json({ error: true, mensaje: 'Error al buscar paciente' });
    }
});
module.exports = router;