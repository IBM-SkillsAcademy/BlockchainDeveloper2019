'use strict';

const express = require('express');
const controller = require('./controller');
const bodyParser = require('body-parser');
const router = express.Router();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.post('/orders', controller.placeOrder);
router.put('/orders', controller.updateOrder);
router.get('/orders', controller.getOrder);
router.get('/orders/status', controller.getOrder);
router.get('/orders/status/paginated', controller.getOrdersByStatusPaginated);
router.get('/orders/history', controller.getHistoryForOrder);
router.post('/', controller.createVehicle);
router.get('/', controller.getVehicle);
router.get('/price', controller.getPrice);
router.get('/price/range', controller.getPriceByRange);
router.post('/price', controller.updatePrice);
router.post('/vin/request', controller.requestVIN);
router.post('/policies/request', controller.requestPolicy);
router.get('/policies', controller.getPolicy);
router.get('/history', controller.getHistoryForVehicle);
module.exports = router;
