var Ripchat = new Marionette.Application();

Ripchat.API = {
  onUserConnect: function(socket) {
    
    // When a new message is received
    socket.on("newMessage", Ripchat.Controller.displayNewMessage);
    // When the server sends back the socket id
    socket.on("socketId", function(socketId) {

      socket.id = socketId;
    });
    // Set a request handler so we can get the active socket in future
    Ripchat.reqres.setHandler("activeSocket", function() {

      return socket;
    });
  }
};

Ripchat.on("before:start", function() {

  Ripchat.UI = new AppLayout();
});

Ripchat.on("start", function(){

  var rooms = ["developers", "designers", "producers"];
  var messageCollections = {};

  // Create a new message collection for each room
  for(var i = 0; i< rooms.length; i++) {

    var roomId = rooms[i];

    var messageCollection = Ripchat.request("newMessageCollection:entities", [{
      sender: "admin",
      content: "Welcome to the " + roomId + " room!"
    }]);

    messageCollection.roomId = roomId;

    // Save the collections and views to our objects
    messageCollections[roomId] = messageCollection;
  }

  // Set up a handler to get the message collections
  Ripchat.reqres.setHandler("messageCollection", function(roomId) {

    return messageCollections[roomId];
  });
  // Set up a handler to get the message views
  Ripchat.reqres.setHandler("messageList", function(roomId) {

    return new Ripchat.ChatContainer({
      collection: messageCollections[roomId]
    });
  });

  // Display the first room by default
  Ripchat.Controller.changeRoom(rooms[0]);
});