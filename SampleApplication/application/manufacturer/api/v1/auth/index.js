'use strict';

const express = require('express');
const controller = require('./controller');
const bodyParser = require('body-parser');
const router = express.Router();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.get('/registrar/enroll', controller.enrollAdmin);
router.post('/user/register-enroll', controller.registerUser);
router.post('/user/enroll', controller.register);
module.exports = router;
