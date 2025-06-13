// Importar modelos y librerías necesarias
const Usuario = require('../models/Usuario');

// Controlador de autenticación
module.exports = {
    // Procesar login
    processLogin: async (req, res) => {
        try {
            const { email, password } = req.body;

            // Validaciones básicas
            if (!email || !password) {
                req.session.error = 'Email y contraseña son obligatorios';
                return res.redirect('/login');
            }

            // Buscar usuario (incluyendo el hash de la contraseña)
            const usuario = await Usuario.findByEmail(email);
            if (!usuario) {
                req.session.error = 'Credenciales inválidas';
                return res.redirect('/login');
            }

            // Verificar contraseña
            const isValidPassword = await Usuario.verifyPassword(password, usuario.password);
            if (!isValidPassword) {
                req.session.error = 'Credenciales inválidas';
                return res.redirect('/login');
            }

            // Guardar usuario en sesión (sin la contraseña)
            req.session.user = {
                id: usuario.id,
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                email: usuario.email,
                rol: usuario.rol
            };

            console.log(`✅ Login exitoso: ${usuario.email} (${usuario.rol})`);
            res.redirect('/dashboard');

        } catch (error) {
            console.error('Error en login:', error);
            req.session.error = 'Error interno del servidor';
            res.redirect('/login');
        }
    },

    // ...otros métodos del controlador...
};