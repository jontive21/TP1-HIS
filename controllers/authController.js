// Importar modelos y librerías necesarias
const Usuario = require('../models/Usuario');

// Controlador de autenticación
module.exports = {
    // Mostrar formulario de login
    showLogin: (req, res) => {
        // Si el usuario ya está logueado, redirigir al dashboard
        if (req.session.user) {
            return res.redirect('/dashboard');
        }
        // Renderiza la vista de login. Asumimos 'auth/login'.
        // Los mensajes de error/éxito se manejan globalmente por `addUserToViews`
        res.render('auth/login', { title: 'Iniciar Sesión' });
    },// Procesar login
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
            // Eliminar mensajes de error si el login es exitoso
            delete req.session.error;

            console.log(`✅ Login exitoso: ${usuario.email} (${usuario.rol})`);
            res.redirect('/dashboard');

        } catch (error) {
            console.error('Error en login:', error);
            req.session.error = 'Error interno del servidor';
            res.redirect('/login');
        }
    },

    // ...otros métodos del controlador...
    // Logout de usuario
    logout: (req, res) => {
        if (req.session) {
            // Destruir la sesión
            req.session.destroy(err => {
                if (err) {
                    console.error('Error al cerrar sesión:', err);
                    // Aunque haya error, intentar redirigir al login
                    return res.redirect('/login');
                }
                // Limpiar la cookie de sesión del lado del cliente (opcional pero buena práctica)
                // El nombre de la cookie puede variar si se configuró explícitamente en session middleware
                res.clearCookie('connect.sid'); // 'connect.sid' es el nombre por defecto de la cookie de sesión de express-session
                
                console.log('🔌 Sesión cerrada correctamente.');
                res.redirect('/login');
            });
        } else {
            // Si no hay sesión, simplemente redirigir
            res.redirect('/login');
        }
    }
};
exports.login = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    // Buscar usuario en la base de datos
    const [users] = await db.promise().query('SELECT * FROM usuarios WHERE email = ?', [email]);
    
    if (users.length === 0) {
      req.session.error = 'Credenciales inválidas';
      return res.redirect('/login');
    }
    
    const user = users[0];
    
    // Verificar contraseña
    const passwordMatch = await bcrypt.compare(password, user.password);
    
    if (!passwordMatch) {
      req.session.error = 'Credenciales inválidas';
      return res.redirect('/login');
    }
    
    // Establecer sesión
    req.session.user = {
      id: user.id,
      nombre: user.nombre,
      apellido: user.apellido,
      email: user.email,
      rol: user.rol
    };
    
    req.session.lastAccess = new Date().toLocaleString();
    req.session.success = 'Inicio de sesión exitoso';
    
    res.redirect('/dashboard');
  } catch (error) {
    console.error(error);
    req.session.error = 'Error en el servidor';
    res.redirect('/login');
  }
};