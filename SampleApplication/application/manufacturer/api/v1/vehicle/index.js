'use strict';

const express = require('express');
const controller = require('./controller');
const bodyParser = require('body-parser');
const router = express.Router();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.post('/order', controller.placeOrder);
router.put('/order', controller.updateOrder);
router.get('/order', controller.getOrder);
router.get('/order/status', controller.getOrder);
router.get('/order/status/paginated' , controller.getOrdersByStatusPaginated);
router.get('/order/history' , controller.getHistoryForOrder);
router.post('/', controller.createVehicle);
router.get('/', controller.getVehicle);
router.get('/price', controller.getPrice);
router.get('/price/range', controller.getPriceByRange);
router.post('/price', controller.updatePrice);
router.post('/vin/request', controller.requestVIN);
router.post('/policy', controller.requestPolicy);
router.get('/policy', controller.getPolicy);
router.get('/history' , controller.getHistoryForVehicle);
module.exports = router;
