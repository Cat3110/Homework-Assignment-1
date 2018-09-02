/*
 * Homework Assignment #1 for pirple Node.js Master Class
 * by Egor "Catello" Vasilyev
 */

// Dependencies
var http = require('http');
var https = require('https');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;

var config = require('./config.js');

// Initialize Http and Https servers

var httpServer = http.createServer(function(req, res) {
  server(req, res);
});

var httpsServer = https.createServer(config.httpsServerOptions, function(req, res) {
  server(req, res);
});

httpServer.listen(config.httpPort, function() {
  console.log('http server has started on port: ' + config.httpPort);
});

httpsServer.listen(config.httpsPort, function() {
  console.log('https server has started on port: ' + config.httpsPort);
});

// Describing server logic

var server = function(req, res) {

  // Get the URL and parse it
  var parsedUrl = url.parse(req.url, true);

  // Get tha path
  var path = parsedUrl.pathname.replace(/^\/+|\/+$/g,'');

  // Get the method
  var method = req.method;

  // Get the payload and answer
  var decoder = new StringDecoder('utf-8');
  var buffer = '';

  req.on('data', function(data) {
    buffer += data;
  });
  req.on('end', function() {
    buffer += decoder.end();

    // Choose the handler
    var choosenHandler = (path == 'hello' && buffer != '' && method == 'POST') ? router[path] : router['notFound'];
    choosenHandler(function(statusCode, payload) {
      // Use the status code called back to the handler or default
      statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

      // User the payload called back by the handler, or default
      payload = typeof(payload) == 'object' ? payload : {};

      // Convert the payload to a string
      var payloadString = JSON.stringify(payload);

      // Return the response
      res.setHeader('Content-Type', 'application/json');
      res.writeHead(statusCode);
      res.end(payloadString);

      // Log the request path
      console.log('Returning this response: ', statusCode, payloadString);

    })
  })


};

// Define handlers
var handlers = {};

handlers.hello = function(callback) {
  callback(200, {'message': 'welcome message'})
};

handlers.notFound = function(callback) {
  callback(404, {'message': 'notFound'})
};

// Define request router
var router = {
  'hello' : handlers.hello,
  'notFound' : handlers.notFound
};
