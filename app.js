const path = require('path');
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser'); //parse request body and make it available in req.body object
const cron = require('node-cron');
//const errorController = require('./controllers/error');

const fs = require('fs');  
var cors = require('cors');
const app = express();
app.use(cors({
  origin: "*",
 })
); 
const server = require('http').createServer(app);

const io = require('socket.io')(server,{
  cors: {
    origin: "*"
  }
});
const multer = require('multer');
const upload = multer();

const port = process.env.PORT || 3000



app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));

const sequelize = require('./BackEnd/util/database');

const User = require('./BackEnd/models/user');
const Message = require('./BackEnd/models/message');
const Group = require('./BackEnd/models/group');
const UserGroup = require('./BackEnd/models/userGroup');
const ArchivedChats = require('./BackEnd/models/ArchivedChat');


const userRoutes = require('./BackEnd/routes/user'); 
const msgRoutes = require('./BackEnd/routes/message');
const groupRoutes = require('./BackEnd/routes/group');
const mediaRoutes = require('./BackEnd/routes/media');


app.use('/user', userRoutes);
app.use('/user',msgRoutes );
app.use('/user',groupRoutes);
app.use('/media', upload.single('userFile'),mediaRoutes);
app.use(express.json());
//app.use(express.static(path.join(__dirname, 'public'))); 

User.hasMany(Message);
Message.belongsTo(User);

Group.hasMany(Message);
Message.belongsTo(Group);

User.belongsToMany(Group, { through: UserGroup });
Group.belongsToMany(User, { through: UserGroup });

// Users and archived chats relation
User.hasMany(ArchivedChats);
// Groups and archied chats relation
Group.hasMany(ArchivedChats);

io.on("connect", (socket) => {

  socket.on('user', () => {
      console.log(`user is connected`);
  })

  socket.on('joined-group', group => {
       socket.join(group);
  })

  socket.on('send-message', message => {
      socket.to(message.groupId).emit('received-message', message);
  })

  socket.on('disconnect', () => {
      console.log(`user is disconnected`);
  })
});

cron.schedule('0 0 * * *', async () => {
  //running every day 
  try{
      const chats = await Message.findAll();

      for(let chat of chats) {
          await ArchivedChats.create({ message: chat.textmessage, sender: chat.name, groupId: chat.groupId, 
          userId: chat.userId });
          console.log('old chats are stored to archieved table');
          await Message.destroy({ where:{id:chat.id} });
          console.log('chats in the chats table are deleted');
      }
  } catch(err) {
      console.log(err);
  }
})

sequelize.sync().then(result => {
  server.listen(3000);
  console.log('server is running');
}).catch(err => {
  console.log(err);
})