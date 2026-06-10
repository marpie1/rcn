// scp-medication server component
// Registers additional Express routes so that scp-vital, scp-symptom, and
// scp-visit type items also load from this same JS file.
// wiki-server calls startServer({argv, app}) for each installed plugin.

var path = require('path');
var clientFile = path.join(__dirname, '..', 'client', 'scp-medication.js');
var aliasTypes = ['scp-vital', 'scp-symptom', 'scp-visit'];

module.exports = {
  startServer: function (params) {
    var app = params.app;
    aliasTypes.forEach(function (type) {
      app.get('/plugins/' + type + '/' + type + '.js', function (req, res) {
        res.sendFile(clientFile);
      });
      app.get('/plugins/' + type + '.js', function (req, res) {
        res.sendFile(clientFile);
      });
    });
  }
};
