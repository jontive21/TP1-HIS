extends ../layout

block content
  h1 Enfermería
  p Aquí irá el módulo de enfermería.

const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('enfermeria/index');
});

module.exports = router;