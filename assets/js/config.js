Backbone.Marionette.Renderer.render = function(templateId, data){
  
  var template = Ripchat.templates[templateId];
  var html = ejs.render(template, data);
  return html;
}