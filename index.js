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
let online = [];
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

  socket.on("send mess", async function(data) {
    const { mess, name } = data;
    if (mess == "") {
      return console.log("user tried to send empty message");
    }

    const regSafe = /[<>]+/i;
    if (regSafe.test(mess)) {
      return console.log("user trieed to use forbidden caracters");
    }

    const sanitMess = data.mess.replace(/\s{2,}/g, " ");
    io.sockets.emit("add mess", { msg: sanitMess, name: name });
    try {
      //find the user
      const user = await User.findOne({ name });
      //  save messages in DB
      const newMessage = new Message({
        name: name.toString(),
        message: sanitMess,
        owner: user._id
      });
      await newMessage.save();
    } catch (error) {
      console.log(error);
    }
  });

  //send a message if someone join the chat
  socket.on("send join", function(data) {
    io.sockets.emit("add join", { name: data.name });
    online.push(data.name);
    io.sockets.emit("add online", { online });
  });

  //send a message if someone left the chat
  socket.on("send left", function(data) {
    io.sockets.emit("add left", { name: data.name });
    if (online.length > 0) {
      online = online.filter(member => member !== data.name);
      io.sockets.emit("add online", { online });
    }
  });
});

// middleware for routes
app.use("/", chatRoute);
app.use("/users", usersRoute);

const PORT = process.env.PORT;

// server.listen(PORT);
server.listen(PORT, console.log(`Server started on port ${PORT}`));
