
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('medico/index');
});

module.exports = router;