const express = require('express');

const messageController = require('../controllers/message');
const auth=require('../middleware/auth');

const router = express.Router();

router.post('/message',auth.authenticate,messageController.chat);

router.get('/getmessage',auth.authenticate,messageController.getchat);



module.exports = router;