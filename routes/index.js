var _ = require('underscore');
var fs = require('fs');
var ac = require('autocomplete');
var namesAC = ac.connectAutocomplete();
var airportNames = {};
var airportCodes = {};
var dataSource = 'data/airport-codes.dat';

fs.readFile(dataSource, function (err, data) {
  var airports = [];

  _.each(data.toString().split('\n'), function (a) {
    var parts = a.trim().split('|');
    var airportName = parts[0];
    var airportNameLower = airportName.toLowerCase();
    var airportCode = parts[1];
    var airportCodeLower = airportCode.toLowerCase();
    var fullName = airportCode + ' - ' + airportName;

    airportNames[airportNameLower] = fullName;
    airportCodes[airportCodeLower] = fullName;

    airports.push(airportNameLower);
    airports.push(airportCodeLower);
  });

  namesAC.initialize(function (onReady) {
    onReady(airports);
  });
});

exports.airports = function (req, res) {
  var airport = req.query.query.toLowerCase();
  var results = namesAC.search(airport);
  var airportResults = _.chain(results)
    .map(function (a) {
      return airportNames[a] || airportCodes[a];
    })
    .map(function (result) {
      return {
        iataCode: result.slice(0, result.indexOf('-') - 1),
        text: result.slice(result.indexOf('-') + 2)
      };
    })
    .value();

  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ airports: airportResults }));
};
