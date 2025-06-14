// controllers/authController.js

const { pool } = require('../database/connection');

// Procesar login
exports.processLogin = async (req, res) => {
    try {
        const { usuario, password } = req.body;

        // Validaciones básicas
        if (!usuario || !password) {
            req.session.error = 'Usuario y contraseña son obligatorios';
            return res.redirect('/login');
        }

        // Buscar usuario en BD
        const [rows] = await pool.query('SELECT * FROM usuarios WHERE usuario = ?', [usuario]);

        if (!rows.length) {
            req.session.error = 'Credenciales inválidas';
            return res.redirect('/login');
        }

        const user = rows[0];

        // Verificar contraseña (simulada)
        if (password !== user.password) {
            req.session.error = 'Contraseña incorrecta';
            return res.redirect('/login');
        }

        // Guardar usuario en sesión
        req.session.user = {
            id: user.id,
            nombre: user.nombre,
            apellido: user.apellido,
            usuario: user.usuario,
            rol: user.rol
        };

        console.log(`✅ Login exitoso: ${user.usuario} (${user.rol})`);
        res.redirect('/dashboard');

    } catch (error) {
        console.error('Error en login:', error.message);
        req.session.error = 'Error interno del servidor';
        res.redirect('/login');
    }
};

// Cerrar sesión
exports.logout = (req, res) => {
    req.session.destroy(err => {
        if (err) throw err;
        res.redirect('/login');
    });
};