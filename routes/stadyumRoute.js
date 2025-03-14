const express = require('express');
const router = express.Router();
const stadyumController = require('../controllers/stadyumController');

// /hakemler endpoint'i için GET isteği yönlendirme
router.get('/stadyumlar', stadyumController.getStadyumlar);
router.delete('/stadyumlar/:id', stadyumController.deleteStadyum);
router.post('/stadyumlar', stadyumController.addStadyum);
router.put('/stadyumlar/:id', stadyumController.updateStadyum);

module.exports = router;
