//  Copyright 2015 Fabian Dietenberger

"use strict";

var request = require('request-promise'),
    url = require('url'),
    _ = require('lodash');

var hypemResolver = {},
    timeout = 5000,
    cookie = "AUTH=03%3A406b2fe38a1ab80a2953869a475ff110%3A1412624464%3A1469266248%3A01-DE";

hypemResolver.urlToId = function (hypemUrl) {
    var hypemTrackUrl = "http://hypem.com/track/";
    var trimmedUrl = _.trim(hypemUrl);
    if (_.startsWith(trimmedUrl, hypemTrackUrl)) { // maybe use url
        var hypemPath = trimmedUrl.slice(hypemTrackUrl.length);
        var hypemId = hypemPath.split("/")[0];
        return hypemId;
    }
    return "";
};

hypemResolver.getById = function (hypemId, callback) {
    var options = {
        method: 'HEAD',
        url: "http://hypem.com/go/sc/" + hypemId,
        followRedirect: false,
        simple: false,
        resolveWithFullResponse: true,
        timeout: timeout
    };

    request(options)
        .then(function (response) {
            var songUrl = response.headers.location;
            if (songUrl === "http://soundcloud.com/not/found" || songUrl === "https://soundcloud.com/not/found") {
                getSongFromExternalSource(hypemId, callback);
            } else {
                // TODO songUrl sometimes ends with /xyz -> remove this
                callback(null, songUrl);
            }
        }).catch(function (reason) {
            callback(reason, null);
        });
};

function getSongFromExternalSource(hypemId, callback) {
    var options = {
        method: "GET",
        url: "http://hypem.com/track/" + hypemId,
        resolveWithFullResponse: true,
        headers: {"Cookie": cookie},
        timeout: timeout
    };

    request(options)
        .then(function (response) {
            var bodyLines = response.body.split('\n');
            _.forIn(bodyLines, function (bodyLine) {
                if (bodyLine.indexOf('key') !== -1) {
                    // first hit should be the correct one
                    // fix if hypem changes that
                    try {
                        var key = JSON.parse(bodyLine.replace('</script>', '')).tracks[0].key;
                        getMP3(hypemId, key, callback);
                    } catch (e) {
                        // if error happens here, first check the cookie value (maybe refresh)
                        // if this is not helping, manually check the body of the request for the key value
                    }
                }
            });
        })
        .catch(function (reason) {
            callback(new Error("Nothing found: " + reason.options.url));
        });
}

function getMP3(hypemId, hypemKey, callback) {
    var options = {
        method: "GET",
        url: "http://hypem.com/serve/source/" + hypemId + "/" + hypemKey,
        resolveWithFullResponse: true,
        headers: {"Cookie": cookie},
        timeout: timeout
    };

    request(options)
        .then(function (response) {
            // the request got a json from hypem
            // where the link to the mp3 file is saved
            var jsonBody = JSON.parse(response.body);
            var mp3Url = jsonBody.url;
            callback(null, mp3Url);
        })
        .catch(function (reason) {
            callback(new Error("Nothing found: " + reason.options.url));
        });
}

module.exports = hypemResolver;