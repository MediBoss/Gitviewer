const express = require("express");
const http = require("http");
const port = process.env.PORT || 3000;
var app = express()

app.get('/', function(request, response){
  console.log("Hello Gitviewer");
})

// SERVER BOOTING UP
app.listen(port);
