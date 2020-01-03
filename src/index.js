const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");

// setup express
const app = express();
// create a web server || express typically does this behind the scenes, but socket.io expects the server to be passed to it
const server = http.createServer(app);
// config socket.io to work with the server, it nows supports websockets
const io = socketio(server);

const PORT = process.env.PORT;

// serve static files
const publicDirectoryPath = path.join(__dirname, "../public");
app.use(express.static(publicDirectoryPath));

async function start() {
    try {
      // connect to db
        await require("./db/mongoose");
        // server.listen(PORT);
        server.listen(PORT, console.log(`Server started on port ${PORT}`));
        app.get('/chat', function(req, res) {
          res.sendFile(path.join(__dirname, '../public', 'chat.html'));
        });
        
        users = [];
        connections = [];
        
        io.sockets.on('connection', function(socket) {
            console.log("Success connection");
            connections.push(socket);
        
            socket.on('disconnect', function(data) {
            connections.splice(connections.indexOf(socket), 1);
            console.log("Disconnection");
            });
            
            socket.on('send mess', function(data) {
            io.sockets.emit('add mess', {msg: data.mess, name: data.name});
          });
        });
    } catch (e) {
        console.log(e);
    }
};

start();