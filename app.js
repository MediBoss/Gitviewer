// var express = require("express");
// var app = express()
// var http = require("http").Server(app);
// var io = require('socket.io')(http);
// var path = require('path');
// const port = process.env.PORT || 3000;
// app.use(express.static("public"));
//
// app.get('/', function(request, response){
//   response.sendFile(path.join(__dirname+'/home.html'))
// });
//
// io.on('connection', function(socket){
//   socket.on("clientEvent", function(data){
//     console.log('data : '+ data)
//   })
// });
//
// // SERVER BOOTING UP
// http.listen(port);
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// app.get('/', function(req, res){
//   res.sendFile(__dirname + '/index.html');
// });

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
  });
});


http.listen(3000, function(){
  console.log('listening on *:3000');
});
