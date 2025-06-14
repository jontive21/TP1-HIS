const express = require('express');
const router = express.Router();
const { showDashboard } = require('../controllers/dashboardController');

router.get('/', showDashboard); // ✅ Bien hecho

module.exports = router;