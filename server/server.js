const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const {generateMessage, generateLocationMessage} = require('./utils/message.js')

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('new user connected')

    socket.emit('newMessage',generateMessage('admin', 'welcome to the chat!'))
    socket.broadcast.emit('newMessage', generateMessage('admin', 'new user joined'))

    socket.on('createMessage', (data, callback) => {
      io.emit('newMessage', generateMessage(data.from,data.text))
      callback('got it. this is from the server')
    });

    socket.on('createLocationMessage', (location) => {
      io.emit('newLocationMessage', generateLocationMessage('admin', location.lat , location.long))
    })

    socket.on('disconnect', () => {
        console.log('User was disconnected');
      });
})

server.listen(port, () => {
  console.log(`Server is up on ${port}`);
});
