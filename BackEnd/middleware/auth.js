const jwt=require("jsonwebtoken");

const User=require('../models/user');
const Group=require('../models/group');

const authenticate= async(req,res,next)=>{
    try{
        //const token=req.header('Authorization');
        //console.log(token);
        // const user=jwt.verify(token,'niveditha');
        //    console.log('userID >>>>', user.userId);
        //    User.findByPk(user.userId)
        //    .then(user=>{
        //       console.log(user);
        //        req.user=user;
        //        next();
        //    })

        //   .catch(err=>{
         //     res.status(500).json({err:err});
         // })
         const token = req.header('Authorization');
         console.log(token);
         const user = jwt.verify(token, 'niveditha');
         const group = jwt.verify(token, 'niveditha');
         console.log('userID >>>>',user.userId, user.name);
         const users = await User.findByPk(user.userId)
         const groups = await Group.findByPk(group.GroupId)
             console.log('values'+JSON.stringify(groups));
             console.log('values of user'+JSON.stringify(users));
             req.user = users;
             req.group = groups;
             next();
       
    }catch(err){
        console.log(err);
        return res.status(401).json({success:false}) 
    }
}


module.exports={
    authenticate    
}