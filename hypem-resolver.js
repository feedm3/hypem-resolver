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
        headers: {"Cookie": cookie},
        timeout: timeout
    };

    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            body = body.split('\n');
            for (var num in body) {
                var key;
                if (String(body[num]).indexOf('key') != -1) {
                    // first strike should be the correct one
                    // fix if hypem changes that
                    try {
                        key = JSON.parse(body[num].replace('</script>', '')).tracks[0].key;
                        var hypemUrl = "http://hypem.com/serve/source/" + hypemId + "/" + key;
                        getMP3(hypemUrl, callback);
                    } catch (e) {
                        // if error happens here, first check the cookie value (maybe refresh)
                        // if this is not helping, manually check the body of the request for the key value
                    }
                }
            }
        } else {
            callback(new Error("Nothing found: " + options.url));
        }
    })
}

function getMP3(hypemLink, callback) {
    var options = {
        method: "GET",
        url: hypemLink,
        headers: {"Cookie": cookie},
        timeout: timeout
    };

    request(options, function (error, response, body) {
        if (!error) {
            if (response.statusCode == 200) {
                // the request got a json from hypem
                // where the link to the mp3 file is saved
                var jsonBody = JSON.parse(body);
                var mp3Url = jsonBody.url;
                callback(null, mp3Url);
            } else {
                callback(new Error("Nothing found: " + options.url));
            }
        } else {
            callback(new Error("Nothing found: " + options.url));
        }
    })
}

module.exports = hypemResolver;