// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;
var request = require('request');

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(__dirname + '/public'));

function getMovieQuote() {
  return new Promise(function(resolve, reject) {
    request({
        url: 'https://andruxnet-random-famous-quotes.p.mashape.com', //URL to hit /?cat=movies
        qs: {cat: 'movies'}, //Query string data
        method: 'POST', // specify the request type
        headers: { // speciyfy the headers
            "X-Mashape-Key": "rB7hQRo2Z2msh4azTtDBcyVIPVcIp1FgqyPjsnsyrIbR7NHcMs",
            "Content-Type": "application/x-www-form-urlencoded",
            "Accept": "application/json"
        }
    }, function(error, response, body){
        if(error) {
            reject(new Error(error));
        } else {
            resolve(body);
        }
    });
  } );
}


io.on('connection', function (socket) {
  console.log('connected!');

    setInterval(function() {
      console.log('getting quote')
      getMovieQuote().then(function(data) {
        console.log(JSON.parse(data).quote);
        socket.broadcast.emit('new message', {
          username: socket.username,
          quote: JSON.parse(data).quote
        });
      }, function(err) {
        console.log(err);
      })
    }, 5000);
});
