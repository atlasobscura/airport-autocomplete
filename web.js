var express = require('express');
var index = require('./routes');
var cors = require('cors');
var path = require('path');
var port = process.env.PORT || 3000;
var app = express.createServer(express.logger());

app.configure(function () {
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.get('/airports', cors({ origin: [
  /atlasobscura\.com/
] }), index.airports);

app.listen(port, function () {
  console.log('Listening on ' + port);
});
