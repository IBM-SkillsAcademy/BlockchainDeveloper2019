'use strict';

const express = require('express');
const controller = require('./controller');
const bodyParser = require('body-parser');
const router = express.Router();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.post('/', controller.createVehicle);
router.get('/', controller.getVehicle);
router.get('/:id', controller.getVehicle);

module.exports = router;
