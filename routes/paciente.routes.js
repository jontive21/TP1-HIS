// routes/paciente.routes.js
const express = require('express');
const router = express.Router();
const Paciente = require('../models/Paciente');
// ✅ RUTA PRINCIPAL - Listado de pacientes
router.get('/', async (req, res) => {
    try {
        console.log('📋 Accediendo al módulo de Pacientes');
        
        const limite = parseInt(req.query.limite) || 50;
        const offset = parseInt(req.query.offset) || 0;
        const busqueda = req.query.busqueda;
        
        let pacientes;
        let totalPacientes = 0;
        
        if (busqueda) {
            pacientes = await Paciente.buscarPorNombre(busqueda);
            totalPacientes = pacientes.length;
        } else {
            pacientes = await Paciente.getAll(limite, offset);
            const estadisticas = await Paciente.getEstadisticas();
            totalPacientes = estadisticas.total_pacientes;
        }
        
        const estadisticas = await Paciente.getEstadisticas();
        
        res.render('pacientes/index', {
            title: 'Gestión de Pacientes',
            pacientes,
            estadisticas,
            busqueda,
            totalPacientes,
            limite,
            offset,
            paginaActual: Math.floor(offset / limite) + 1,
            totalPaginas: Math.ceil(totalPacientes / limite)
        });
    } catch (error) {
        console.error('❌ Error en módulo de pacientes:', error);
        res.status(500).render('error', {
            title: 'Error en Pacientes',
            error: 'No se pudo cargar el módulo de pacientes',
            details: error.message
        });
    }
});
// ✅ NUEVO PACIENTE - Formulario
router.get('/nuevo', (req, res) => {
    res.render('pacientes/nuevo', {
        title: 'Nuevo Paciente'
    });
});
// ✅ CREAR PACIENTE
router.post('/crear', async (req, res) => {
    try {
        const {
            dni, nombre, apellido, fecha_nacimiento, sexo,
            telefono, email, direccion,
            contacto_emergencia_nombre, contacto_emergencia_telefono, contacto_emergencia_relacion,
            obra_social, numero_afiliado,
            alergias, antecedentes_medicos, medicamentos_habituales
        } = req.body;
        // Validar DNI único
        const dniExiste = await Paciente.findByDni(dni);
        if (dniExiste) {
            return res.status(400).render('error', {
                title: 'Error al crear paciente',
                error: `Ya existe un paciente con DNI ${dni}`,
                status: 400
            });
        }
        const pacienteId = await Paciente.create(
            dni, nombre, apellido, fecha_nacimiento, sexo,
            telefono, email, direccion,
            contacto_emergencia_nombre, contacto_emergencia_telefono, contacto_emergencia_relacion,
            obra_social, numero_afiliado,
            alergias, antecedentes_medicos, medicamentos_habituales
        );
        console.log(`✅ Paciente creado exitosamente: ID ${pacienteId}`);
        res.redirect(`/pacientes/${pacienteId}?mensaje=Paciente creado exitosamente`);
        
    } catch (error) {
        console.error('❌ Error creando paciente:', error);
        res.status(500).render('error', {
            title: 'Error al crear paciente',
            error: error.message
        });
    }
});
// ✅ VER PACIENTE - Detalles completos
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const paciente = await Paciente.findById(id);
        
        if (!paciente) {
            return res.status(404).render('error', {
                title: 'Paciente no encontrado',
                error: 'El paciente solicitado no existe',
                status: 404
            });
        }
        // Obtener historial de admisiones
        const historialAdmisiones = await Paciente.getHistorialAdmisiones(id);
        const tieneAdmisionActiva = await Paciente.tieneAdmisionActiva(id);
        res.render('pacientes/detalle', {
            title: `Paciente: ${paciente.nombre} ${paciente.apellido}`,
            paciente,
            historialAdmisiones,
            tieneAdmisionActiva,
            mensaje: req.query.mensaje
        });
    } catch (error) {
        console.error('❌ Error obteniendo paciente:', error);
        res.status(500).render('error', {
            title: 'Error al cargar paciente',
            error: error.message
        });
    }
});
// ✅ EDITAR PACIENTE - Formulario
router.get('/:id/editar', async (req, res) => {
    try {
        const { id } = req.params;
        const paciente = await Paciente.findById(id);
        
        if (!paciente) {
            return res.status(404).render('error', {
                title: 'Paciente no encontrado',
                error: 'El paciente solicitado no existe',
                status: 404
            });
        }
        res.render('pacientes/editar', {
            title: `Editar: ${paciente.nombre} ${paciente.apellido}`,
            paciente
        });
    } catch (error) {
        console.error('❌ Error cargando formulario de edición:', error);
        res.status(500).render('error', {
            title: 'Error al cargar formulario',
            error: error.message
        });
    }
});
// ✅ ACTUALIZAR PACIENTE
router.post('/:id/actualizar', async (req, res) => {
    try {
        const { id } = req.params;
        const datosActualizados = req.body;
        // Si se cambió el DNI, validar que sea único
        if (datosActualizados.dni) {
            const dniUnico = await Paciente.validarDniUnico(datosActualizados.dni, id);
            if (!dniUnico) {
                return res.status(400).render('error', {
                    title: 'Error al actualizar paciente',
                    error: `Ya existe otro paciente con DNI ${datosActualizados.dni}`,
                    status: 400
                });
            }
        }
        const actualizado = await Paciente.update(id, datosActualizados);
        
        if (actualizado) {
            console.log(`✅ Paciente ${id} actualizado exitosamente`);
            res.redirect(`/pacientes/${id}?mensaje=Información actualizada exitosamente`);
        } else {
            res.status(404).render('error', {
                title: 'Paciente no encontrado',
                error: 'No se pudo actualizar el paciente',
                status: 404
            });
        }
        
    } catch (error) {
        console.error('❌ Error actualizando paciente:', error);
        res.status(500).render('error', {
            title: 'Error al actualizar paciente',
            error: error.message
        });
    }
});
// ✅ API: Buscar paciente por DNI (para AJAX)
router.get('/api/buscar/:dni', async (req, res) => {
    try {
        const { dni } = req.params;
        const paciente = await Paciente.findByDni(dni);
        
        if (paciente) {
            res.json({
                encontrado: true,
                paciente: {
                    id: paciente.id,
                    dni: paciente.dni,
                    nombre: paciente.nombre,
                    apellido: paciente.apellido,
                    fecha_nacimiento: paciente.fecha_nacimiento,
                    sexo: paciente.sexo,
                    telefono: paciente.telefono,
                    email: paciente.email,
                    obra_social: paciente.obra_social,
                    numero_afiliado: paciente.numero_afiliado
                }
            });
        } else {
            res.json({
                encontrado: false,
                mensaje: 'Paciente no encontrado'
            });
        }
    } catch (error) {
        console.error('❌ Error en API buscar paciente:', error);
        res.status(500).json({ error: 'Error al buscar paciente' });
    }
});
// ✅ API: Buscar pacientes por nombre (autocomplete)
router.get('/api/buscar-nombre/:termino', async (req, res) => {
    try {
        const { termino } = req.params;
        const pacientes = await Paciente.buscarPorNombre(termino, 10);
        
        res.json(pacientes.map(p => ({
            id: p.id,
            dni: p.dni,
            nombre: p.nombre,
            apellido: p.apellido,
            nombre_completo: `${p.nombre} ${p.apellido}`,
            obra_social: p.obra_social
        })));
    } catch (error) {
        console.error('❌ Error en API buscar por nombre:', error);
        res.status(500).json({ error: 'Error al buscar pacientes' });
    }
});
// ✅ API: Estadísticas de pacientes
router.get('/api/estadisticas', async (req, res) => {
    try {
        const estadisticas = await Paciente.getEstadisticas();
        res.json(estadisticas);
    } catch (error) {
        console.error('❌ Error obteniendo estadísticas:', error);
        res.status(500).json({ error: 'Error al obtener estadísticas' });
    }
});
// ✅ PACIENTES INTERNADOS
router.get('/internados', async (req, res) => {
    try {
        const pacientesInternados = await Paciente.getPacientesInternados();
        
        res.render('pacientes/internados', {
            title: 'Pacientes Internados',
            pacientes: pacientesInternados
        });
    } catch (error) {
        console.error('❌ Error obteniendo pacientes internados:', error);
        res.status(500).render('error', {
            title: 'Error en Pacientes Internados',
            error: error.message
        });
    }
});
// ✅ DESACTIVAR PACIENTE (Soft delete)
router.post('/:id/desactivar', async (req, res) => {
    try {
        const { id } = req.params;
        const { motivo } = req.body;
        // Verificar que no tenga admisiones activas
        const tieneAdmisionActiva = await Paciente.tieneAdmisionActiva(id);
        if (tieneAdmisionActiva) {
            return res.status(400).json({
                error: 'No se puede desactivar un paciente con admisión activa'
            });
        }
        const desactivado = await Paciente.desactivar(id, motivo);
        
        if (desactivado) {
            console.log(`⚠️ Paciente ${id} desactivado`);
            res.json({ 
                success: true, 
                mensaje: 'Paciente desactivado exitosamente' 
            });
        } else {
            res.status(404).json({ error: 'Paciente no encontrado' });
        }
        
    } catch (error) {
        console.error('❌ Error desactivando paciente:', error);
        res.status(500).json({ error: 'Error al desactivar paciente' });
    }
});
// ✅ RUTA DE PRUEBA
router.get('/test', (req, res) => {
    res.json({
        mensaje: 'Módulo de Pacientes funcionando correctamente',
        timestamp: new Date().toISOString(),
        endpoint: '/pacientes'
    });
});
module.exports = router;