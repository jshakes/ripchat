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