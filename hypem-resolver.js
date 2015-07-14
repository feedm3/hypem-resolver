//  Copyright 2015 Fabian Dietenberger

"use strict";

var q = require('q'),
    request = require('request'),
    _ = require('lodash');

var hypemResolver = {},
    hypemTrackUrl = "http://hypem.com/track/",
    hypemGoUrl = "http://hypem.com/go/sc/",
    timeout = 5000;

hypemResolver.getById = function (hypemId, callback) {
    var url = hypemGoUrl + hypemId;
    var options = {method: "HEAD", followRedirect: false, url: url, timeout: timeout};

    request(options, function (err, response) {
        if (err || response.statusCode !== 302) {
            callback(err, null);
        } else {
            var soundcloudUrl = response.headers.location;
            if (soundcloudUrl  == "http://soundcloud.com/not/found" || soundcloudUrl == "https://soundcloud.com/not/found") {
                callback(new Error("Nothing found with the id: " + hypemId));
            } else {
                callback(null, soundcloudUrl);
            }
        }
    });
};

hypemResolver.urlToId = function (hypemUrl) {
    var trimmedUrl = _.trim(hypemUrl);
    if (_.startsWith(trimmedUrl, hypemTrackUrl)) { // maybe use url
        var hypemPath = trimmedUrl.slice(hypemTrackUrl.length);
        var hypemId = hypemPath.split("/")[0];
        return hypemId;
    } else {
        callback(new Error("Hypem url is not correct. It should start with 'http://hypem.com/track/'", null));
    }
};

module.exports = hypemResolver;