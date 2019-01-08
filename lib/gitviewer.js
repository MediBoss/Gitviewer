const http = require("http");
const https = require("https");
const fs = require("fs");
const url = require("url");
const util = require("util");
const EventEmmiter = require('events').EventEmmiter;

var request = require('request'),
    statusCodes = require('http').STATUS_CODES;

function Gitviewer(opts) {
  this.method = 'GET';
  this.website = '';
  this.github_handle = '';
  this.timeout = 10;
  this.handle = null;
  this.init(opts)
}

//util.inherits(Gitviewer, EventEmmiter);

Gitviewer.prototype.init = function (opts) {

  const interval = opts.interval || opts.timeout || 15;
  const website = opts.website;

  if (!website){
    console.log('error')
    //return this.emit('error', new Error('You did not specify a website to monitor'));

  }

  this.method = opts.method || this.method;
  this.website = website;
  this.github_handle = opts.github_handle

  this.interval = (interval * (60 * 1000));

  // start monitoring
  this.start();
}

Gitviewer.prototype.start = function() {

  users = require('../dummy_users')
  const time = Date.now();
  const current_user_handle = this.github_handle
  console.log("\nMonitoring: " + this.github_handle+ " account")
  users.forEach(function(user){
    if (user.github_handle == current_user_handle){
      console.log(user.name + " your profile has been viewed.")
    }
  })

  // create an interval for pings
  this.handle = setInterval(() => {
      this.ping();
  }, this.interval);
}

Gitviewer.prototype.ping = function (){
  const options = url.parse(this.website);
  let currentTime = Date.now();
  let request;

  options.method = this.method;

  if(this.website.indexOf('https:') == 0){
    request = https.request(options, (response) =>{
      this.latency = Date.now() - currentTime;

      // Website is up
      if (response.statusCode === 200) {
        this.isOk();
      }
      // No error but website not ok
      else {
        this.isNotOk(response.statusCode);
      }
    });
  }

  request.on('error', (error) => {
    this.isNotOk(500, error.message);
  });

  request.end();
}

Gitviewer.prototype.isOk = function () {
  let data = this.responseData(200, 'OK', this.website);

  //this.emit('up', data);
  console.log("Pinged");
}

Gitviewer.prototype.isNotOk = function (statusCode, message) {
  let msg = message || statusCodes[statusCode];
  let data = this.responseData(statusCode, msg, this.website);

  //this.emit('down', data);
  console.log("Not Pinged");
}

Gitviewer.prototype.log = function (status, message) {
  var self = this,
      time = Date.now(),
      output = '';

  output += "\nWebsite: " + self.website;
  output += "\nTime: " + time;
  output += "\nStatus: " + status;
  output += "\nMessage:" + msg  + "\n";

  console.log(output);
}


    // log: function (status, msg) {
    //     var self = this,
    //         time = Date.now(),
    //         output = '';
    //
    //     output += "\nWebsite: " + self.website;
    //     output += "\nTime: " + time;
    //     output += "\nStatus: " + status;
    //     output += "\nMessage:" + msg  + "\n";
    //
    //     console.log(output);
    // },


    Gitviewer.prototype.getFormatedDate = function (time) {
      let currentDate = new Date(time);

      currentDate = currentDate.toISOString();
      currentDate = currentDate.replace(/T/, ' ');
      currentDate = currentDate.replace(/\..+/, '');

      return currentDate;
    }


    Gitviewer.prototype.responseData = function (statusCode, msg, website) {
      let data = {
        time: Date.now(),
        statusCode: statusCode,
        statusMessage: msg,
        website: website
      };

      return data;
    }

module.exports = Gitviewer;
