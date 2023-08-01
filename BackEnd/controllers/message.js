const Message = require('../models/message');

const chat = async(req,res,next) => {
    try{
        const { message }= req.body;
        console.log(message);
        if(message == undefined || message.length === 0 ){
            return res.status(400).json({ err: "Parameters Missing" });
        }else{
            const result = await Message.create({ message, userId:req.user.id , username: req.user.name });
            res.status(201).json({ message: "Message Sent", success: true });
        }
    }catch(err){
        console.error(err);
        res.status(500).json({ err: "Something went wrong" });
    }

}

const getchat = async (req, res, next) => {
    try {
        const messages = await Message.findAll()
        res.status(201).json({ success: true, message: messages });
    }
    catch (err) {
        res.status(500).json({ message: err, success: false })
    }
}

module.exports = {
    chat,
    getchat
}