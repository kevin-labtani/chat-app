const express = require("express");
const indexRoute = require("./routes/index");
const usersRoute = require("./routes/users");

// connect to db
require("./db/mongoose");

const app = express();

const PORT = process.env.PORT;

// express middleware for routes
app.use("/", indexRoute);
app.use("/users", usersRoute);

app.listen(PORT, console.log(`Server started on port ${PORT}`));
