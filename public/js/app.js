var Ripchat = new Marionette.Application();

Ripchat.API = {
  onUserConnect: function(socket) {
    
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
Backbone.Marionette.Renderer.render = function(templateId, data){
  
  var template = Ripchat.templates[templateId];
  var html = ejs.render(template, data);
  return html;
}
Ripchat.Controller = {
  displayNewMessage: function(data) {

  },
  sendNewMessage: function(content) {

  }
};
Ripchat.module("Entities", function(Entities, Ripchat, Backbone, Marionette, $, _){

  Entities.Message = Backbone.Model.extend({
    initialize: function() {
      this.set("timestamp", new Date().getTime());
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
// Declare a region to display our messages in
var messagesRegion = new Marionette.Region({
  el: ".chat-pane"
});

AppLayout =  Marionette.LayoutView.extend({
  el: "body",
  events: {
    "change #username-input": "changeUsername"
  },
  regions: {
    header: ".page-header",
    messages: messagesRegion
  },
  changeUsername: function(e) {
    var $input = $(e.currentTarget);
    var $label = $("label[for=" + $input.attr("id") + "]").html($input.val());
  }
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
    if(this.model.get("fromSelf")) {

      this.$el.addClass("self");
    }
  }
});

Ripchat.ChatContainer = Marionette.CompositeView.extend({
  template: "chat-container",
  childView: Ripchat.MessageItem,
  childViewContainer: ".message-list",
  events: {
    "keyup .chat-new-message-field": "onKeyup",
    "click .chat-new-message-submit": "sendMessage"
  },
  initialize: function() {

    console.log(this.collection);
  },
  onKeyup: function(e) {

    var content = $(e.currentTarget).val();
   
    // If enter key was pressed, send the message
    if(e.which === 13) {

      e.preventDefault();
      this.sendMessage();
    }
  },
  sendMessage: function(e) {

    var $msgField = $(".chat-new-message-field");
    var content = $msgField.val();
    Ripchat.Controller.sendNewMessage(content);
    $msgField.val("");
  }
});