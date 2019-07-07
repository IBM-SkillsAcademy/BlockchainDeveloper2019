'use strict';

const express = require('express');
const controller = require('./controller');
const bodyParser = require('body-parser');
const router = express.Router();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.get('/orders', controller.getOrder);
router.get('/orders/status', controller.getOrder);
router.get('/', controller.getVehicle);
router.post('/owner/change', controller.changeOwner);
router.delete('/delete', controller.deleteVehicle);
router.get('/price', controller.getPrice);
router.get('/price/range', controller.getPriceByRange);
router.post('/vin/issue', controller.issueVIN);
router.get('/policies', controller.getPolicy);

module.exports = router;
