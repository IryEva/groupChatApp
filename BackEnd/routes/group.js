const express = require('express');

const groupController = require('../controllers/group');
const auth=require('../middleware/auth');

const router = express.Router();

router.post('/add-group',auth.authenticate,groupController.addGroup);

router.get('/get-group',auth.authenticate,groupController.getGroup);

router.post('/add/:userId/:groupId', groupController.addUserToGroup);

router.get('/members/:groupId', groupController.getGroupMembers);

router.post('/admin/:userGroupId', groupController.updateIsAdmin);

router.delete('/remove/:id', groupController.deleteGroupMember);


module.exports = router;