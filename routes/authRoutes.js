const express = require('express');
const {login} = require('../controller/authRegister');
const router = express.Router();

router.post("/login",login);

module.exports = router;