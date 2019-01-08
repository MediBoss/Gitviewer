const express = require("express");
const http = require("http");
const port = process.env.PORT || 3000;
var app = express()

var Gitviewer = require('./lib/gitviewer'),

    users = require('./dummy_users')
    websites = [
      {
        url: "https://www.github.com/AlirieGray",
        github_handle: "AlirieGray",
        timeout: 5
      }
    ],

    monitors = [];

    websites.forEach(function(website){

      var monitor = new Gitviewer({
        website: website.url,
        github_handle: website.github_handle,
        timeout: website.timeout
      });
      monitors.push(monitor)
    });

app.get('/', function(request, response){
  console.log("Hello Gitviewer");
})


// SERVER BOOTING UP
app.listen(port);
