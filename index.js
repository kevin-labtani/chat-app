const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const expressLayouts = require("express-ejs-layouts");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const chatRoute = require("./routes/chat");
const usersRoute = require("./routes/users");
const Message = require("./models/Message");
const User = require("./models/User");

// connect to db
require("./db/mongoose");

// passport config
require("./config/passport");

// setup express
const app = express();

// ejs templating engine middleware
app.use(expressLayouts);
app.set("view engine", "ejs");

// bodyparser middleware
// used to parse POST request body from form data
app.use(express.urlencoded({ extended: false }));

// middleware for sessions
// we need sessions to use connect-flash
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
  })
);

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// middleware for connect-flash
// used  to send message on redirect
app.use(flash());

// global variables for flashing messages
// we want specific colors for specific messages
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  // passport error from failureFlash option
  res.locals.error = req.flash("error");
  next();
});

// create a web server || express typically does this behind the scenes, but socket.io expects the server to be passed to it
const server = http.createServer(app);
// config socket.io to work with the server, it nows supports websockets
const io = socketio(server);

// serve static files
const publicDirectoryPath = path.join(__dirname, "/public");
app.use(express.static(publicDirectoryPath));

io.sockets.on("connection", function(socket) {
  console.log("Success connection");

  socket.on("disconnect", function(data) {
    console.log("Disconnection");
  });

  socket.on("send mess", function(data) {
    io.sockets.emit("add mess", { msg: data.mess, name: data.name });
    //find the user
    User.findOne({ name: data.name }).then(user => {
      //  save messages in DB
      const newMessage = new Message({
        name: data.name.toString(),
        message: data.mess,
        owner: user._id
      });
      newMessage.save();
    });
  });

  socket.on("send join", function(data) {
    io.sockets.emit("add join", { name: data.name });
  });

  socket.on("send left", function(data) {
    io.sockets.emit("add left", { name: data.name });
  });
});

// middleware for routes
app.use("/", chatRoute);
app.use("/users", usersRoute);

const PORT = process.env.PORT;

// server.listen(PORT);
server.listen(PORT, console.log(`Server started on port ${PORT}`));
