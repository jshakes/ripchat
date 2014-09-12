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