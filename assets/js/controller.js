Ripchat.Controller = {
  displayNewMessage: function(data) {

    var messageCollection = Ripchat.request("messageCollection");
    var socket = Ripchat.request("activeSocket");
    if(data.sender !== socket.id) {
      data.fromSelf = true;
    }
    // Dispatch the message to the correct room
    var messageCollection = Ripchat.request("messageCollection", roomId);
    messageCollection.add(data);
  },
  sendNewMessage: function(content, roomId) {

    // Get the currently active socket object
    var socket = Ripchat.request("activeSocket");
    var data = {
      content: content,
      roomId: roomId,
      sender: $("#username-input").val()
    };
    socket.emit("newMessage", data);
  },
  changeRoom: function(roomId) {

    var messagesView = Ripchat.request("messageList", roomId);
    messagesRegion.show(messagesView);
  }
};