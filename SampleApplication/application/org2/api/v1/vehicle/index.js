'use strict';

const express = require('express');
const controller = require('./controller');
const bodyParser = require('body-parser');
const router = express.Router();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.get('/', controller.getVehicle);
router.post('/change-owner', controller.changeOwner);
router.delete('/delete', controller.deleteVehicle);
router.get('/price', controller.getPrice);

module.exports = router;
