const Group = require('../models/group');
const User = require('../models/user');
//const jwt = require('jsonwebtoken');
const UserGroup = require('../models/userGroup');
const sequelize = require('../util/database');

function isStringInvalid(string) {
    if(string == undefined || string.length === 0) {
        return true;
    } else {
        return false;
    }
}

const addGroup = async(req,res) => {
        const t = await sequelize.transaction();
    try {
        const { groupName } = req.body;
        const name = req.user.name;

        if(isStringInvalid(groupName)) {
            return res.status(400).json({error: "Parameters are missing"});
        }

        const group = await Group.create({ groupName:groupName, createdBy:name, userId:req.user.id },{ transaction: t});
        const userGroup = await UserGroup.create({ userId:req.user.id, groupId: group.dataValues.id, isAdmin: true},
        { transaction: t})

        await t.commit();
        res.status(202).json({ newGroup:group, message: `Successfully created ${groupName}`, userGroup })

    }catch(err){
        console.log(err);
        res.status(500).json({ error: err });

    }
}

const getGroup = async(req,res) => {
    try{
        const userGroup = await UserGroup.findAll({ where:{userId: req.user.id}});
        
        let groupsList = [];
        for(let i=0; i<userGroup.length; i++) {
            let group_id = userGroup[i].dataValues.groupId;
            const groups = await Group.findByPk(group_id);
            groupsList.push(groups)
        }
        const users = await User.findAll();
       
        res.status(201).json({ listOfUsers: users, groupsList, userGroup})
    }catch(err){
        console.log(err);
        res.status(500).json({ error: 'Something went wrong' });
    } 
}

const addUserToGroup = async(req, res) => {
    const t = await sequelize.transaction();
    try{
        const { userId, groupId } = req.params;

        const userGroup = await UserGroup.create({ userId, groupId, isAdmin:false },{ transaction: t});

        await t.commit();
        res.status(202).json({ userGroup, message: 'Successfully added user to your group' })
    } catch(err) {
        await t.rollback();
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error'})
    }
} 

const getGroupMembers =  async(req,res) => {
    try{

        const { groupId } = req.params;
        const usersDetails = [];
        const userGroup = await UserGroup.findAll({where: {groupId}});
        for(let i=0; i<userGroup.length; i++) {
            let userId = userGroup[i].dataValues.userId;
            const user = await User.findByPk(userId)
            usersDetails.push(user)
        }
        res.status(201).json({ usersDetails, userGroup });

    }catch(error){
        console.log(error);
    }
}

const updateIsAdmin = async(req,res) => {
    const t = await sequelize.transaction();
    try{
        const userGroupId = req.params.userGroupId;
        
        const userGroup = await UserGroup.findOne({ where:{id: userGroupId } });

        const updateAdmin = await userGroup.update({ isAdmin: true }, { transaction:t });

        await t.commit();
        res.status(202).json({ updateAdmin , message: `Successfully made Admin of Group`});

    }catch(error){
        await t.rollback();
        console.log(err);
        res.status(500).json({ error: `Internal Server Error` });
    }
}

const deleteGroupMember = async(req,res) => {
    const t = await sequelize.transaction();
    try {
        const { id } = req.params;
        
        const userGroup = await UserGroup.destroy({ where:{ id } }, { transaction: t});

        await t.commit();
        res.status(200).json({ userGroup , message: `Successfully removed group member`})
    } catch(err) {
        await t.rollback();
        console.log(err);
        res.status(500).json({ error: `Internal Server Error` });
    }
}

module.exports= {
    addGroup,
    getGroup,
    addUserToGroup,
    getGroupMembers,
    updateIsAdmin,
    deleteGroupMember

}