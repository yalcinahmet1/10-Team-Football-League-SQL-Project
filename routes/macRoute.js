const express = require('express');
const router = express.Router();
const macController = require('../controllers/macController');

// Example route for simulating matches
router.post('/simulateMatches', macController.simulateMatches);

// Example route for getting played matches
router.get('/playedMatches', macController.getPlayedMatches);

module.exports = router;
