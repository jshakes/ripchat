var Index = require(config.root + "app/controllers/IndexController");

/*
============================================
Routes
============================================
*/

module.exports = function (app) {

  app.get("/", Index.index);
};