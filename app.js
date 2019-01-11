// Mini socket server to interact with the chrome extension

var express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
var app = express()
var http = require("http").Server(app);
var io = require('socket.io')(http);
var path = require('path');
const port = process.env.PORT || 3000;
app.use(express.static("public"));



io.on('connection', function(socket){
  socket.on("github event", function(data){
    console.log('data : '+ data)
  })
});

// SERVER BOOTING UP
http.listen(port);
