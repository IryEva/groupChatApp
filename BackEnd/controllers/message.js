const Message = require('../models/message');

const postMessage = async(req, res) => {
    try {
        const { textMessage, groupId } = req.body;

        const name = req.user.name;
        const chats = await Message.create({ 
            message:textMessage, 
            sender: name, 
            groupId:groupId, 
            userId: req.user.id 
        });
        
        res.status(201).json({ textMessage: chats, message: 'Successfully sended message' })

    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const getMessage = async (req, res, next) => {
    try {
        //const groupId = req.query.groupId;
        const { groupId } = req.params;
        const message = await Message.findAll({ where:{groupId} });
        //res.status(201).json({ success: true, message: messages });
        if (message.length > 0) {
            res.status(201).json({ message: message})
        } else {
            res.status(401).json({ err: "empty chats" })
        }
    }
    catch (err) {
        res.status(500).json({ message: err, success: false })
    }
}

module.exports = {
    postMessage,
    getMessage
}