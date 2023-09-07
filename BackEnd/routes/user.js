const express = require('express');

const userController = require('../controllers/user');
//const auth=require('../middleware/auth');

const router = express.Router();

router.post('/signup',userController.signup);

router.post('/login',userController.login);

router.get('/users', userController.getUsers);

module.exports = router;