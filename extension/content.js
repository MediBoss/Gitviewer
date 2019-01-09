
// Returns the github handle of the visited gihub pages


// (function () {
//
//   const socket = io('http://localhost:3000');
//   socket.on('connect', async () => {
//     console.log("Connection made");
//   })
//
//   var user_url = window.location.pathname.split('/');
//   const user_github_handle = user_url[1];
//   console.log(user_github_handle);
// }());


//Socket server connect to listen to data.

function getScript(source, callback) {
    var el = document.createElement('script');
    el.onload = callback;
    el.src = source;

    document.body.appendChild(el);
}

(function(){
  console.log("inside anonymous function")
  getScript('http://localhost:3000/socket.io/socket.io.js',function() {
      console.log("Inside get script")
      const socket = io.connect('http://localhost:3000/');
      socket.on('connect', function(){
      console.log("connection made")
          socket.on('clientEvent', function (data) {
              console.log("Ready to send data to socket server")
              socket.emit('clientEvent', "please see this");
          });

      });

  });
}());
