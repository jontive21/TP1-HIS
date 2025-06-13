// controllers/authController.js
const bcrypt = require('bcryptjs');

exports.loginGet = (req, res) => {
  const message = req.flash('error') || null;
  res.render('login', { message });
};

exports.loginPost = async (req, res) => {
  const { usuario, password } = req.body;

  const [rows] = await pool.query('SELECT * FROM usuarios WHERE usuario = ?', [usuario]);

  if (!rows.length) {
    req.flash('error', 'Usuario o contraseña incorrectos');
    return res.redirect('/login');
  }

  const user = rows[0];
  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    req.flash('error', 'Contraseña incorrecta');
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