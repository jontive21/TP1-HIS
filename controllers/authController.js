// controllers/authController.js

exports.showLogin = (req, res) => {
  const message = req.session.error || null;
  delete req.session.error;

  res.render('login', { message });
};

exports.processLogin = async (req, res) => {
  const { usuario, password } = req.body;

  if (!usuario || !password) {
    req.session.error = 'Usuario y contraseña son obligatorios';
    return res.redirect('/login');
  }

  // Usuarios de prueba – en producción usa base de datos
  const users = [
    { id: 1, nombre: 'Administrador', usuario: 'admin', password: '123456', rol: 'administrador' },
    { id: 2, nombre: 'Enfermera', usuario: 'enfermera', password: '123456', rol: 'enfermeria' },
    { id: 3, nombre: 'Médico', usuario: 'medico', password: '123456', rol: 'medico' }
  ];

  const user = users.find(u => u.usuario === usuario && u.password === password);

  if (!user) {
    req.session.error = 'Usuario o contraseña incorrectos';
    return res.redirect('/login');
  }

  req.session.user = user;
  res.redirect('/dashboard');
};

exports.logout = (req, res) => {
  req.session.destroy(err => {
    if (err) throw err;
    res.redirect('/login');
  });
};