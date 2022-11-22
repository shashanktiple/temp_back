var express = require("express");

var app = express();

require("./setupMongo")();

app.use(express.json());
app.use("/auth", require("./routes/auth"));
app.use("/post", require("./routes/post"));
app.use("/todo", require("./routes/todo"));

module.exports = app;
