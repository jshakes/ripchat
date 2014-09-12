var Ripchat = new Marionette.Application();

Ripchat.API = {
  onUserConnect: function(socket) {
    
    // When a new message is received
    socket.on("newMessage", Ripchat.Controller.displayNewMessage);
    // Set a request handler so we can get the active socket in future
    Ripchat.reqres.setHandler("activeSocket", function() {

      return socket;
    });
  }
};

Ripchat.on("start", function(){

  // Declare a region to display our messages in
  var messagesRegion = new Marionette.Region({
    el: ".chat-pane"
  });

  // Create a new message collection
  var messageCollection = Ripchat.request("newMessageCollection:entities", [{
    sender: "jshakes",
    content: "hello"
  }]);

  var messageList = new Ripchat.ChatContainer({
    collection: messageCollection
  });

  messagesRegion.show(messageList);

  // Set up a handler to get the message collection
  Ripchat.reqres.setHandler("messageCollection", function() {

    return messageCollection;
  })

});