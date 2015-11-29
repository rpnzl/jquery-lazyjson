var fs = require('fs');
var express = require('express');
var bodyParser = require('body-parser');
var json = require('./data.json');
var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use('/dist', express.static(__dirname + '/../dist'));

function apiRequest(req, res) {
  var query = req.query || {};
  var size = parseInt(query.size) || 10;
  var page = parseInt(query.page) || 1;
  var data = json.slice(0);
  var batches = [];

  while (data.length) {
    batches.push(data.splice(0, size));
  }

  res.json({
    pagination: {
      page: page,
      size: size,
      total_count: json.length
    },
    data: batches[page - 1]
  });
}

app.get('/json', apiRequest);
app.use(express.static(__dirname));

app.listen(3000, function () {
  console.log('[jquery-lazyjson:server] listening on port %s', 3000);
});
