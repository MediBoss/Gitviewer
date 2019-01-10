var socket = io.connect('http://localhost:3000/socket.io/socket.io.js');
socket.on("hello",function(data){
    console.log(data.text);
    chrome.runtime.sendMessage({msg:"socket",text:data.text},function(response){});
});

//Returns the github handle of the visited gihub pages


// (function () {
//   // const socket = io('http://localhost:3000');
//   // socket.on('connect', async () => {
//   //   console.log("Connection made");
//   // })
//
//   var user_url = window.location.pathname.split('/');
//   const user_github_handle = user_url[1];
//   console.log(user_github_handle);
// }());

//
// //Socket server connect to listen to data.
//
//
// var io;
// function getScript(source, callback) {
//     var el = document.createElement('script');
//     el.onload = callback;
//     el.src = source;
//
//     document.body.appendChild(el);
//     io = el;
// }
//
//
// (function(){
//   console.log("inside anonymous funtion")
//   var user_url = window.location.pathname.split('/');
//   const user_github_handle = user_url[1];
//   getScript("https://cdn.socket.io/socket.io-1.0.0.js",function() {
//       console.log("inside get script")
//       const socket = io.connect('http://localhost:3000/');
//       socket.on('connect', function(){
//         console.log("Connection made??")
//           socket.on('clientEvent', function (data) {
//               socket.emit('clientEvent', "please see this");
//           });
//
//       });
//
//   });
// }());

// var socket = io.connect('https://gitviewerserver.herokuapp.com/');
// socket.on("hello",function(data){
//     console.log(data.text);
//     chrome.runtime.sendMessage({msg:"socket",text:data.text},function(response){});
// });


//
// (function(){
//
//   console.log("outside getscript");
//   getScript("http://localhost:3000/socket.io/socket.io.js", function(){
//     console.log("inside get script")
//     var socket = io.connect('http://localhost:3000');
//     socket.on("hello",function(data){
//         console.log(data.text);
//         chrome.runtime.sendMessage({msg:"socket",text:data.text},function(response){});
//     });
//   }());
//   });
