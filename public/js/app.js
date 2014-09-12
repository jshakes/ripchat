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
Backbone.Marionette.Renderer.render = function(templateId, data){
  
  var template = Ripchat.templates[templateId];
  var html = ejs.render(template, data);
  return html;
}
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
Ripchat.module("Entities", function(Entities, Ripchat, Backbone, Marionette, $, _){

  Entities.Message = Backbone.Model.extend({
    defaults: {
      timestamp: new Date().getTime()
    }
  });

  Entities.MessageCollection = Backbone.Collection.extend({
    model: Entities.Message
  });

  // Set our req/res handlers

  Ripchat.reqres.setHandler("newMessageCollection:entities", function(models){ 
    
    return new Entities.MessageCollection(models);
  });
});
Ripchat.MessageItem = Marionette.ItemView.extend({
  template: "chat-message",
  tagName: "li",
  className: "chat-message",
  initialize: function() {

    // Save a human-readable version of the timestamp to the model
    var dateObj = new Date(this.model.get("timestamp"));
    var dateStr = dateObj.getHours() + ":";
    if(dateObj.getMinutes().toString().length < 2) {
      dateStr += "0";
    }
    dateStr += dateObj.getMinutes() + ":" + dateObj.getSeconds();
    this.model.set("when", dateStr);
  },
  onRender: function() {

    // If the message is from the other user, add a class to the el
    if(this.model.get("remote")) {

      this.$el.addClass("remote");
    }
  }
});

Ripchat.ChatContainer = Marionette.CompositeView.extend({
  template: "chat-container",
  childView: Ripchat.MessageItem,
  childViewContainer: ".message-list",
  events: {
    "keyup .chat-new-message-field": "onKeyup"
  },
  initialize: function() {

    console.log(this.collection);
  },
  onKeyup: function(e) {

    var content = $(e.currentTarget).val();
   
    // If enter key was pressed, send the message
    if(e.which === 13) {

      e.preventDefault();
      Ripchat.Controller.sendNewMessage(content);
      $(e.currentTarget).val("");
    }
  }
});