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