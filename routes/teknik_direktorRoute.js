const express = require('express');
const router = express.Router();
const teknik_direktorController = require('../controllers/teknik_direktorController');

router.get(
  '/teknik_direktorler',
  teknik_direktorController.getTeknikDirektorler
);
router.post('/teknik_direktorler', teknik_direktorController.addTeknikDirektor);
router.put(
  '/teknik_direktorler/:id',
  teknik_direktorController.updateTeknikDirektor
);
router.delete(
  '/teknik_direktorler/:id',
  teknik_direktorController.deleteTeknikDirektor
);

module.exports = router;
