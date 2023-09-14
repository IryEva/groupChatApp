const express = require('express');

const mediaController = require('../controllers/mediaFile');
const auth=require('../middleware/auth');

const router = express.Router();

router.post('/file/:groupId',auth.authenticate,mediaController.postMediaFile);


module.exports = router;