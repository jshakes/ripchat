Ripchat.Controller = {
  displayNewMessage: function(data) {

    var messageCollection = Ripchat.request("messageCollection");
    var socket = Ripchat.request("activeSocket");
    if(data.sender !== socket.id) {
      data.remote = true;
    }
    messageCollection.add(data);
  },
  sendNewMessage: function(content) {

    // Get the currently active socket object
    var socket = Ripchat.request("activeSocket");
    socket.emit("newMessage", content);
    Chat.Controller.userIsNotTyping();
  }
};