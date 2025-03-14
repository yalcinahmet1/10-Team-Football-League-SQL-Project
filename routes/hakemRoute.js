const express = require('express');
const router = express.Router();
const hakemController = require('../controllers/hakemController');

// /hakemler endpoint'i için GET isteği yönlendirme
router.get('/hakemler', hakemController.getHakemler);
router.delete('/hakemler/:id', hakemController.deleteHakem);
router.post('/hakemler', hakemController.addHakem);
router.put('/hakemler/:id', hakemController.updateHakem);

module.exports = router;
