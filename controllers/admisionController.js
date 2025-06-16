const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database/his.db');

// Listar admisiones
exports.listar = (req, res) => {
  db.all(`
    SELECT a.id, p.nombre, p.apellido, h.numero as habitacion, 
           strftime('%d/%m/%Y %H:%M', a.fecha_admision) as fecha
    FROM admisiones a
    JOIN pacientes p ON a.paciente_id = p.id
    JOIN habitaciones h ON a.habitacion_id = h.id
    WHERE a.estado = 'activa'
  `, (err, admisiones) => {
    if (err) {
      console.error(err);
      return res.render('admisiones/list', { 
        error: 'Error al cargar admisiones',
        admisiones: []
      });
    }
    res.render('admisiones/list', { admisiones, error: null });
  });
};

// Mostrar formulario
exports.nuevoForm = (req, res) => {
  db.parallelize(() => {
    db.all("SELECT id, nombre || ' ' || apellido as nombre FROM pacientes", (err, pacientes) => {
      db.all(`SELECT id, numero 
              FROM habitaciones 
              WHERE capacidad = 1 AND sanitizada = 1
                 OR capacidad = 2 AND sanitizada = 1 
                    AND id NOT IN (
                      SELECT habitacion_id 
                      FROM admisiones 
                      WHERE estado = 'activa'
                    )`, (err, habitaciones) => {
        res.render('admisiones/new', { pacientes, habitaciones, error: null });
      });
    });
  });
};

// Crear admisión
exports.crear = (req, res) => {
  const { paciente_id, habitacion_id } = req.body;
  
  db.run(
    `INSERT INTO admisiones (paciente_id, habitacion_id) 
     VALUES (?, ?)`,
    [paciente_id, habitacion_id],
    function(err) {
      if (err) {
        console.error(err);
        return res.render('admisiones/new', {
          error: 'Error al registrar admisión',
          pacientes: [],
          habitaciones: []
        });
      }
      res.redirect('/admisiones');
    }
  );
};