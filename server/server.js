const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const {generateMessage, generateLocationMessage} = require('./utils/message.js')
const {isRealString} = require('./utils/validation.js')
const {Users} = require('./utils/users.js')

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users()

app.use(express.static(publicPath));
 
io.on('connection', (socket) => {
    console.log('new user connected')

    socket.on('join', (params, callback) => {
      if (!isRealString(params.name) || !isRealString(params.room)) {
        return callback('Name and room name are required.');
      }
      socket.join(params.room);

      users.removeUser(socket.id)
      users.addUser(socket.id, params.name, params.room)
      io.to(params.room).emit('updateUsersList', users.getUserList(params.room))

      socket.emit('newMessage',generateMessage('Admin', `Welcome to ${params.room}'s Chat`))
      socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined.`));
      callback();
    });

    socket.on('createMessage', (data, callback) => {
      var user = users.getUser(socket.id)
      if(user && isRealString(data.text)){
      io.to(user.room).emit('newMessage', generateMessage(user.name,data.text))
      callback('got it. this is from the server')
      }
    });

    socket.on('createLocationMessage', (location) => {
      var user = users.getUser(socket.id)
      io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, location.lat , location.long))
    })

    socket.on('disconnect', () => {
        console.log('User was disconnected');
        var user = users.removeUser(socket.id)
        if(user){
        io.to(user.room).emit('updateUsersList', users.getUserList(user.room))
        socket.broadcast.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left`))
        }
      });
})

server.listen(port, () => {
  console.log(`Server is up on ${port}`);
});
