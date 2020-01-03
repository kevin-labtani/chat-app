const path = require("path");
const express = require("express");

// connect to db
require("./db/mongoose");

const app = express();

const PORT = process.env.PORT;

// serve static files
const publicDirectoryPath = path.join(__dirname, "../public");
app.use(express.static(publicDirectoryPath));

app.listen(PORT, console.log(`Server started on port ${PORT}`));
