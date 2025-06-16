// routes/admision.routes.js
const express = require('express');
const router = express.Router();
const Admision = require('../models/Admision');
const Paciente = require('../models/Paciente');
const Cama = require('../models/Cama');
const Habitacion = require('../models/Habitacion');
// ✅ RUTA PRINCIPAL DEL MÓDULO - ENDPOINT DE INICIO
router.get('/', async (req, res) => {
    try {
        console.log('📋 Accediendo al módulo de Admisiones');
        
        // Obtener estadísticas para el dashboard
        const admisionesRecientes = await Admision.getRecientes(10);
        const camasDisponibles = await Cama.getDisponibles();
        const estadisticas = await Admision.getEstadisticas();
        
        res.render('admisiones/index', {
            title: 'Módulo de Admisión y Recepción',
            admisiones: admisionesRecientes,
            camasDisponibles: camasDisponibles.length,
            estadisticas,
            mensaje: 'Sistema de Admisión y Recepción de Pacientes'
        });
    } catch (error) {
        console.error('❌ Error en módulo de admisiones:', error);
        res.status(500).render('error', {
            title: 'Error en Admisiones',
            error: 'No se pudo cargar el módulo de admisiones',
            details: error.message
        });
    }
});
// ✅ NUEVA ADMISIÓN - Formulario
router.get('/nueva', async (req, res) => {
    try {
        const camasDisponibles = await Cama.getDisponibles();
        const habitaciones = await Habitacion.getAll();
        
        res.render('admisiones/nueva', {
            title: 'Nueva Admisión',
            camas: camasDisponibles,
            habitaciones
        });
    } catch (error) {
        console.error('❌ Error cargando formulario de nueva admisión:', error);
        res.status(500).send('Error al cargar formulario');
    }
});
// ✅ BUSCAR PACIENTE - Por DNI
router.get('/buscar-paciente/:dni', async (req, res) => {
    try {
        const { dni } = req.params;
        const paciente = await Paciente.findByDni(dni);
        
        if (paciente) {
            res.json({
                encontrado: true,
                paciente: paciente
            });
        } else {
            res.json({
                encontrado: false,
                mensaje: 'Paciente no encontrado. Se debe crear nuevo registro.'
            });
        }
    } catch (error) {
        console.error('❌ Error buscando paciente:', error);
        res.status(500).json({ error: 'Error al buscar paciente' });
    }
});
// ✅ CREAR ADMISIÓN - Procesamiento
router.post('/crear', async (req, res) => {
    try {
        const {
            // Datos del paciente
            paciente_id,
            dni,
            nombre,
            apellido,
            fecha_nacimiento,
            sexo,
            telefono,
            email,
            direccion,
            obra_social,
            numero_afiliado,
            // Datos de la admisión
            cama_id,
            medico_responsable_id,
            motivo_internacion,
            tipo_ingreso,
            observaciones
        } = req.body;
        let pacienteIdFinal = paciente_id;
        // Si no hay paciente_id, crear nuevo paciente
        if (!pacienteIdFinal) {
            console.log('🆕 Creando nuevo paciente');
            pacienteIdFinal = await Paciente.create(
                dni, nombre, apellido, fecha_nacimiento, sexo,
                telefono, email, direccion, obra_social, numero_afiliado
            );
        }
        // Verificar que la cama esté disponible
        const cama = await Cama.findById(cama_id);
        if (!cama || cama.estado !== 'libre') {
            throw new Error('La cama seleccionada no está disponible');
        }
        // Aplicar reglas de negocio para habitaciones compartidas
        const habitacion = await Habitacion.findById(cama.habitacion_id);
        const camasEnHabitacion = await Cama.findByHabitacion(cama.habitacion_id);
        
        if (camasEnHabitacion.length > 1) {
            // Verificar si hay otras camas ocupadas en la habitación
            const camasOcupadas = camasEnHabitacion.filter(c => c.estado === 'ocupada');
            if (camasOcupadas.length > 0) {
                // Verificar compatibilidad de sexo
                for (let camaOcupada of camasOcupadas) {
                    const admisionExistente = await Admision.findByCamaId(camaOcupada.id);
                    if (admisionExistente) {
                        const pacienteExistente = await Paciente.findById(admisionExistente.paciente_id);
                        if (pacienteExistente && pacienteExistente.sexo !== sexo) {
                            throw new Error('No se puede asignar la cama: habitación ocupada por paciente de sexo diferente');
                        }
                    }
                }
            }
        }
        // Crear la admisión
        const admisionId = await Admision.create(
            pacienteIdFinal,
            cama_id,
            medico_responsable_id || 1, // Default si no se especifica
            new Date().toISOString(),
            motivo_internacion,
            tipo_ingreso || 'programada',
            observaciones,
            'sistema' // usuario_creacion
        );
        // Actualizar estado de la cama
        await Cama.updateEstado(cama_id, 'ocupada');
        console.log(`✅ Admisión creada exitosamente: ID ${admisionId}`);
        
        res.redirect('/admisiones?mensaje=Admisión creada exitosamente');
        
    } catch (error) {
        console.error('❌ Error creando admisión:', error);
        res.status(500).render('error', {
            title: 'Error al crear admisión',
            error: error.message
        });
    }
});
// ✅ VER ADMISIÓN - Detalles
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const admision = await Admision.findByIdWithDetails(id);
        
        if (!admision) {
            return res.status(404).render('error', {
                title: 'Admisión no encontrada',
                error: 'La admisión solicitada no existe'
            });
        }
        res.render('admisiones/detalle', {
            title: `Admisión #${id}`,
            admision
        });
    } catch (error) {
        console.error('❌ Error obteniendo admisión:', error);
        res.status(500).send('Error al obtener admisión');
    }
});
// ✅ CANCELAR ADMISIÓN
router.post('/:id/cancelar', async (req, res) => {
    try {
        const { id } = req.params;
        const { motivo_cancelacion } = req.body;
        
        const admision = await Admision.findById(id);
        if (!admision) {
            return res.status(404).json({ error: 'Admisión no encontrada' });
        }
        // Cancelar admisión
        await Admision.cancelar(id, motivo_cancelacion, 'sistema');
        
        // Liberar la cama
        await Cama.updateEstado(admision.cama_id, 'libre');
        
        console.log(`🚫 Admisión ${id} cancelada: ${motivo_cancelacion}`);
        
        res.json({ 
            success: true, 
            mensaje: 'Admisión cancelada exitosamente' 
        });
        
    } catch (error) {
        console.error('❌ Error cancelando admisión:', error);
        res.status(500).json({ error: 'Error al cancelar admisión' });
    }
});
// ✅ API: Obtener camas disponibles por habitación
router.get('/api/camas-disponibles/:habitacion_id', async (req, res) => {
    try {
        const { habitacion_id } = req.params;
        const camas = await Cama.getDisponiblesByHabitacion(habitacion_id);
        res.json(camas);
    } catch (error) {
        console.error('❌ Error obteniendo camas:', error);
        res.status(500).json({ error: 'Error al obtener camas' });
    }
});
// ✅ RUTA DE PRUEBA
router.get('/test', (req, res) => {
    res.json({
        mensaje: 'Módulo de Admisión funcionando correctamente',
        timestamp: new Date().toISOString(),
        endpoint: '/admisiones'
    });
});
module.exports = router;