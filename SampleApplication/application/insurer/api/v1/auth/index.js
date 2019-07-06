'use strict';

const express = require('express');
const controller = require('./controller');
const bodyParser = require('body-parser');
const router = express.Router();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.get('/enroll-admin', controller.enrollAdmin);
router.get('/create-affiliation', controller.createAffiliation);
router.post('/register-user', controller.registerUser);

module.exports = router;
