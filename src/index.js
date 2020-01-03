const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");

// connect to db
require("./db/mongoose");

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

io.on("connection", () => {
  console.log("a user connected");
});

server.listen(PORT, console.log(`Server started on port ${PORT}`));
