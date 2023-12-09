const express = require('express');
const { signUp, logIn, healthApi} = require('../controllers/userController');
const validateToken = require('../middleware/validateTokenHandler');
const isLoggedIn = require('../middleware/validateUser');

const router = express.Router();

router.post('/signup',signUp)

router.post('/login',logIn)

// router.get('/health',healthApi)

module.exports = router