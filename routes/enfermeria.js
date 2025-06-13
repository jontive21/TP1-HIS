const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('enfermeria/index');
});

module.exports = router;