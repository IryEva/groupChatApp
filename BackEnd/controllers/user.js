const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

 function isStringInvalid(string) {
     if(string == undefined || string.length=== 0){
         return true;
     }else {
         return false;
     }
 }

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

function generateAccessToken(id,name){ 
    return jwt.sign({userId:id,name:name},'niveditha')
  }

 
const login = async (req,res) => {
    try {
        const { email,password } = req.body ;
        console.log(email);
        if( isStringInvalid(email) || isStringInvalid(password)){
            return res.status(400).json({err: "Bad params . something is missing"})
        }
        const user = await User.findAll({where : { email }})
        if(user.length > 0) {
            bcrypt.compare(password,user[0].password, (err,result) => {
                if(err){
                    throw new Error('something went wrong')
                }
                if(result === true){
                    return res.status(200).json({ success: true, message: "User Logged in Successfully",token:generateAccessToken(user[0].id,user[0].name), user: user})
                } else {
                    return res.status(400).json({ success:false, message: "Password is incorrect"})
                }
            })
            
        } else {
            return res.status(404).json({success: false, message:"User doesn't exist"})
        }
    } catch(err) {
        res.status(500).json({message:err , success:false})

    }
}

const getUsers = async(req, res) => {
    try {
        const users = await User.findAll();
        res.status(202).json({ listOfUsers: users })
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: `Internal Server Error` })
    }
}

module.exports = {
    signup,
    login,
    getUsers
}

