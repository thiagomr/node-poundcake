const express = require('express');
const router = express.Router();

const { mainController } = require('../controllers');

router.get('/ping', mainController.ping);

module.exports = router;
