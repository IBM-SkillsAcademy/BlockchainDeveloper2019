'use strict';

const express = require('express');
const controller = require('./controller');
const bodyParser = require('body-parser');
const router = express.Router();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
router.post('/order' , controller.placeOrder);
router.post('/', controller.createVehicle);
router.get('/', controller.getVehicle);
router.get('/price', controller.getPrice);
router.post('/price', controller.updatePrice);
router.post('/policy' , controller.getPolicy);
router.get('/policy' , controller.getPolicies);
module.exports = router;
