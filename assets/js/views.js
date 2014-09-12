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
    var roomId = this.collection.roomId;
    Ripchat.Controller.sendNewMessage(content, roomId);
    $msgField.val("");
  }
});