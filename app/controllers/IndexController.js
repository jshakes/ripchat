exports.index = function(req, res){

  var renderData = {
    host: req.headers.host.split(':')[0]
  }
  res.render('index', renderData);
};

var io = require('socket.io').listen(1337);

io.sockets.on('connection', function (socket) {

  socket.emit('socketId', socket.id);

  socket.on('joinRoom', function(roomId) {
    
    console.log('User joined room');
    socket.join(roomId);
  });
  socket.on('newMessage', function(data) {

    var roomId = data.roomId;
    data.senderId = socket.id;
    io.sockets.in(roomId).emit('newMessage', data);
  });
});