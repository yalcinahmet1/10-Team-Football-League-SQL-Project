const express = require('express');
const router = express.Router();
const puanTablosuController = require('../controllers/puanTablosuController');

router.get('/puanTablosu', puanTablosuController.getPuanTablosu);

module.exports = router;
