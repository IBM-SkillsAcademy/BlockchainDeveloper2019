'use strict';

const express = require('express');
const controller = require('./controller');
const bodyParser = require('body-parser');
const router = express.Router();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.get('/enroll-admin', controller.enrollAdmin);
router.post('/register-user', controller.registerUser);
router.get('/create-affiliation', controller.createAffiliation);

module.exports = router;
