exports.index = function(req, res){

  var renderData = {
    host: req.headers.host.split(':')[0]
  }
  res.render('index', renderData);
};