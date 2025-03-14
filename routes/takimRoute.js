const express = require('express');
const router = express.Router();
const takimController = require('../controllers/takimController');

router.get('/takimlar', takimController.getTakimlar);
router.put('/takimlar/:id', takimController.updateTakim);

module.exports = router;
