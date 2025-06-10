extends ../layout

block content
  h1 Médicos
  p Aquí irá el módulo de médicos.

const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('medico/index');
});

module.exports = router;