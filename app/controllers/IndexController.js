exports.index = function(req, res){

  var renderData = {
    host: req.headers.host.split(':')[0]
  }
  res.render('index', renderData);
};

var io = require('socket.io').listen(1337);

io.sockets.on('connection', function (socket) {

  socket.on('newMessage', function(data) {

    io.sockets.emit('newMessage', data);
  });
});