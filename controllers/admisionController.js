const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database/his.db');

// Promisificar métodos de la base de datos para usar async/await
const dbGet = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

const dbAll = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

const dbRun = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
};

// Listar admisiones
exports.listar = async (req, res) => {
  try {
    const admisiones = await dbAll(`
      SELECT a.id, p.nombre, p.apellido, h.numero as habitacion, 
             strftime('%d/%m/%Y %H:%M', a.fecha_admision) as fecha
      FROM admisiones a
      JOIN pacientes p ON a.paciente_id = p.id
      JOIN habitaciones h ON a.habitacion_id = h.id
      WHERE a.estado = 'activa'
    `);
    
    res.render('admisiones/list', { 
      admisiones,
      error: null
    });
  } catch (err) {
    console.error(err);
    res.render('admisiones/list', { 
      error: 'Error al cargar admisiones',
      admisiones: []
    });
  }
};

// Mostrar formulario
exports.nuevoForm = async (req, res) => {
  try {
    const pacientes = await dbAll("SELECT id, nombre || ' ' || apellido as nombre FROM pacientes");
    const habitaciones = await dbAll(`
      SELECT id, numero 
      FROM habitaciones 
      WHERE sanitizada = 1
        AND capacidad = 1
        OR capacidad = 2 AND sanitizada = 1 
          AND id NOT IN (
            SELECT habitacion_id 
            FROM admisiones 
            WHERE estado = 'activa'
          )
    `);
    
    res.render('admisiones/new', { 
      pacientes, 
      habitaciones,
      error: null
    });
  } catch (err) {
    console.error(err);
    res.render('admisiones/new', {
      error: 'Error al cargar el formulario',
      pacientes: [],
      habitaciones: []
    });
  }
};

// Crear admisión CON VALIDACIÓN DE GÉNERO
exports.crear = async (req, res) => {
  const { paciente_id, habitacion_id } = req.body;
  
  try {
    // 1. Verificar datos obligatorios
    if (!paciente_id || !habitacion_id) {
      throw new Error('Debe seleccionar un paciente y una habitación');
    }
    
    // 2. Obtener datos del paciente
    const paciente = await dbGet('SELECT genero FROM pacientes WHERE id = ?', [paciente_id]);
    if (!paciente) throw new Error('Paciente no encontrado');
    
    // 3. Obtener datos de la habitación
    const habitacion = await dbGet('SELECT capacidad FROM habitaciones WHERE id = ?', [habitacion_id]);
    if (!habitacion) throw new Error('Habitación no encontrada');
    
    // 4. Validar regla de mismo género en habitaciones compartidas
    if (habitacion.capacidad === 2) {
      const companeros = await dbAll(`
        SELECT p.genero 
        FROM admisiones a
        JOIN pacientes p ON a.paciente_id = p.id
        WHERE a.habitacion_id = ? 
          AND a.estado = 'activa'
      `, [habitacion_id]);
      
      if (companeros.length > 0) {
        if (companeros[0].genero !== paciente.genero) {
          throw new Error('No se puede asignar a habitación compartida con paciente de género diferente');
        }
      }
    }
    
    // 5. Crear la admisión
    await dbRun(
      `INSERT INTO admisiones (paciente_id, habitacion_id) 
       VALUES (?, ?)`,
      [paciente_id, habitacion_id]
    );
    
    res.redirect('/admisiones');
  } catch (error) {
    console.error(error);
    
    try {
      // Recargar datos para mostrar el formulario nuevamente
      const pacientes = await dbAll("SELECT id, nombre || ' ' || apellido as nombre FROM pacientes");
      const habitaciones = await dbAll(`
        SELECT id, numero 
        FROM habitaciones 
        WHERE sanitizada = 1
          AND capacidad = 1
          OR capacidad = 2 AND sanitizada = 1 
            AND id NOT IN (
              SELECT habitacion_id 
              FROM admisiones 
              WHERE estado = 'activa'
            )
      `);
      
      res.render('admisiones/new', { 
        pacientes, 
        habitaciones,
        error: error.message
      });
    } catch (err) {
      console.error('Error secundario:', err);
      res.render('admisiones/new', {
        error: 'Error crítico al procesar la solicitud',
        pacientes: [],
        habitaciones: []
      });
    }
  }
};