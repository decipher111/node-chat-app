const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const {generateMessage, generateLocationMessage} = require('./utils/message.js')
const {isRealString} = require('./utils/validation.js')

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));
 
io.on('connection', (socket) => {
    console.log('new user connected')

  
    socket.on('createMessage', (data, callback) => {
      io.emit('newMessage', generateMessage(data.from,data.text))
      callback('got it. this is from the server')
    });

    socket.on('join', (params, callback) => {
      if (!isRealString(params.name) || !isRealString(params.room)) {
        callback('Name and room name are required.');
      }
      socket.join(params.room);
      socket.emit('newMessage',generateMessage('admin', `Welcome to ${params.room}'s Chat`))
      socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined.`));
      callback();
    });

    socket.on('createLocationMessage', (location) => {
      io.emit('newLocationMessage', generateLocationMessage('admin', location.lat , location.long))
    })

    socket.on('leaveRoom', (params, callback) => {
      socket.broadcast.to(params.room).emit('newMessage', generateMessage('admin', `${params.name} left the chat`))
      socket.leave(params.room)
      callback()
    })

    socket.on('disconnect', () => {
        console.log('User was disconnected');
      });
})

server.listen(port, () => {
  console.log(`Server is up on ${port}`);
});
