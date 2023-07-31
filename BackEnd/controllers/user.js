const User = require('../models/user');
const bcrypt = require('bcrypt');
//const jwt = require('jsonwebtoken');

 function isStringInvalid(string) {
     if(string == undefined || string.length=== 0){
         return true;
     }else {
         return false;
     }
 }


//  const signup = async (req,res) => {      
//      try{
//          const { name, email , password ,phonenumber} = req.body;
//          console.log(name);
//          console.log('****',email)
//          if(isstringinvalid(name) || isstringinvalid(email) || isstringinvalid(password) ||  isstringinvalid(phonenumber)){
//              return res.status(400).json({err: "Bad params . something is missing"})
//          }
//          const saltrounds = 10;
//          bcrypt.hash(password, saltrounds, async (err,hash) => {
//             await User.create( { name,email,password: hash,phonenumber})
//             res.status(201).json({message: 'Succesfully done'})
//          })
        
//      } catch(err) {
//         console.log(err);
//          res.status(500).json(err);

//      }
//  }
const signup = async(req, res) => {
    try {
        console.log(req.body);
        const {name, email, phonenumber, password} = req.body;
       

        if(isStringInvalid(name) || isStringInvalid(email) || isStringInvalid(phonenumber) || isStringInvalid(password)) {
            return res.status(400).json({error: "Bad parameters. Something is missing"})
        }

        const user = await User.findOne({ where: { email }});

        if(user) {
            return res.status(400).json({ error: 'User already exist, Please Login'});
        }

        const hash = await bcrypt.hash(password, 10);

        const newUser = await User.create({ name, email, phonenumber, password:hash })
        res.status(201).json({ message: 'Successfully created New User Account'})

        console.log('New user id >>>>',newUser.dataValues.id);
    } catch(err) {
        res.status(500).json({error:'Something went wrong'});
        console.log(err);
    }
}
 
module.exports = {
    signup
}