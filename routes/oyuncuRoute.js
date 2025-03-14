const express = require('express');
const router = express.Router();
const oyuncuController = require('../controllers/oyuncuController');

router.get('/oyuncular', oyuncuController.getOyuncular);
router.put('/oyuncular/:id', oyuncuController.updateOyuncu);

// router.post('/oyuncular', oyuncuController.addOyuncu);

module.exports = router;
