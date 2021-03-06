const request = require('request');
const isStringEmpty = require('fuckingundefinedemptynull').isStringSet;
const process = require('process');

// Utils
var headers = require('./headers');
var apiprefix = require('./apiprefix');

module.exports = {
  get: (info, callback) => {
    var isopen = info.isopen || false;

    var site = info.siteprefix || "testnet";
    var path = apiprefix({endpoint: "position", version: "v1", querystring: "filter=" + encodeURIComponent("{\"isOpen\": " + isopen.toString() + "}")});
    var url = "https://" + site + ".bitmex.com" + path;
    var method = "GET";
    var apikey = info.apikey || process.env.APIKEY || "";
    var apisecret = info.apisecret || process.env.APISECRET || "";

    request({method: method, uri: url, headers: headers({path: path, verb: method, key: apikey, secret: apisecret})}, function(error, response, body) {
      if (!error) {
        var parsed;
        try {
          parsed = JSON.parse(body);
        } catch (e) {
          parsed = [];
        }
        if (parsed.error !== undefined) {
          callback({message: "Error", error: parsed.error.message});
        } else {
          callback({message: "Done", position: parsed});
        }
      } else {
        callback({message: "Error", error: error});
      }
    });
  }
}
