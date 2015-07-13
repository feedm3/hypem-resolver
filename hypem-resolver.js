//  Copyright 2015 Fabian Dietenberger

'use-strict';

var q = require('q'),
    request = require('request'),
    _ = require('lodash');

var hypemResolver = {},
    hypemTrackUrl = "http://hypem.com/track/",
    hypemGoUrl = "http://hypem.com/go/sc/";

hypemResolver.getById = function (hypemId, callback) {
    var url = hypemGoUrl + hypemId;
    var options = {method: "HEAD", followRedirect: false, url: url};
    var testResultUrl = "https://soundcloud.com/griz/summer-97-ft-muzzy-bearr";

    request(options, function (err, response, body) {
        if (err || response.statusCode != 200) {
            callback(err, testResultUrl);
        } else {
            callback(null, testResultUrl);
        }
    });
};

hypemResolver.getByUrl = function (hypemUrl, callback) {
    var trimmedUrl = _.trim(hypemUrl);
    if (_.startsWith(trimmedUrl, hypemTrackUrl)) { // maybe use url
        var hypemPath = hypemUrl.slice(hypemTrackUrl.length);
        var hypemId = hypemPath.split("/")[0];
        this.getById(hypemId, callback)
    } else {
        callback(new Error("Hypem url is not correct. It should start with 'http://hypem.com/track/'", null));
    }
};



module.exports = hypemResolver;