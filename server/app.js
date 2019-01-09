var app = require('express')();
var http = require("http").Server(app);
var io = require('socket.io')(http);
const port = process.env.PORT || 3000;

app.get('/', function(request, response){
  console.log("hi");
});

io.on('connection', function(socket){
  socket.on('clientEvent', function(data){
    console.log('data: '+ data)
  })
});

// SERVER BOOTING UP
http.listen(port);
