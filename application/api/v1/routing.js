'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

// -----------------------------------------------------------------------
// api router
// -----------------------------------------------------------------------
const AuthController = require('./auth/index');
router.use('/auth', AuthController);

module.exports = router;
