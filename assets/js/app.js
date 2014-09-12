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

Ripchat.on("before:start", function() {

  Ripchat.UI = new AppLayout();
});

Ripchat.on("start", function(){

  // Create a new message collection
  var messageCollection = Ripchat.request("newMessageCollection:entities", [{
    sender: "admin",
    content: "Welcome to Ripchat!"
  }]);

  var messageList = new Ripchat.ChatContainer({
    collection: messageCollection
  });

  Ripchat.UI.messages.show(messageList);

  // Set up a handler to get the message collection
  Ripchat.reqres.setHandler("messageCollection", function() {

    return messageCollection;
  })

});