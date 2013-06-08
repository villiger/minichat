var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var currentPid = 1;
var port = 3001;

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

io.sockets.on('connection', function (socket) {
	var name = 'Guest ' + currentPid++;
	
	socket.set('nickname', name, function () {
		socket.emit('nickname', name);
	});
	
	socket.on('set nickname', function (name) {
		socket.set('nickname', name);
	});
	
	socket.on('disconnect', function () {
		socket.get('nickname', function (err, name) {
			io.sockets.emit('diconnected', name);
		});
	});
	
	socket.on('msg', function (msg) {
		socket.get('nickname', function (err, name) {
			socket.broadcast.emit('msg', {
				text : msg,
				from : name
			});
		});
	});
});

server.listen(3001);
