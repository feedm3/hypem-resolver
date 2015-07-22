/**
 * Copyright 2015 Fabian Dietenberger
 * Available under MIT license
 */

"use strict";

var request = require('request'),
    url = require('url'),
    _ = require('lodash');

var hypemResolver = {};

/* Constants */
var FIVE_SECONDS_IN_MILLIS = 5000,
    COOKIE = "AUTH=03%3A406b2fe38a1ab80a2953869a475ff110%3A1412624464%3A1469266248%3A01-DE",
    HYPEM_TRACK_URL = "http://hypem.com/track/",
    HYPEM_GO_URL = "http://hypem.com/go/sc/",
    HYPEM_SERVE_URL = "http://hypem.com/serve/source/";

hypemResolver.urlToId = function (hypemUrl) {
    var trimmedUrl = _.trim(hypemUrl);
    if (_.startsWith(trimmedUrl, HYPEM_TRACK_URL)) {
        var parsedUrl = url.parse(hypemUrl);
        var pathname = parsedUrl.pathname; // '/trach/31jfi/...'
        var hypemId = pathname.split("/")[2];
        return hypemId;
    }
    return "";
};

hypemResolver.getById = function (hypemId, callback) {
    var options = {
        method: 'HEAD',
        url: HYPEM_GO_URL + hypemId,
        followRedirect: false,
        timeout: FIVE_SECONDS_IN_MILLIS
    };

    request(options, function (error, response) {
        if (error || response.statusCode !== 302) {
            callback(error, null);
            return;
        }
        var songUrl = response.headers.location;
        if (songUrl === "http://soundcloud.com/not/found" || songUrl === "https://soundcloud.com/not/found") {
            getSongFromExternalSource(hypemId, callback);
        } else {
            var soundcloudUrl = getNormalizedSoundcloudUrl(songUrl);
            callback(null, soundcloudUrl);
        }
    });
};

module.exports = hypemResolver;

function getSongFromExternalSource(hypemId, callback) {
    var options = {
        method: "GET",
        url: HYPEM_TRACK_URL + hypemId,
        headers: {"Cookie": COOKIE},
        timeout: FIVE_SECONDS_IN_MILLIS
    };

    request(options, function (error, response) {
        if (!error && response.statusCode === 200) {
            var bodyLines = response.body.split('\n');
            _.forIn(bodyLines, function (bodyLine) {
                if (bodyLine.indexOf('key') !== -1) {
                    // first hit should be the correct one
                    // fix if hypem changes that
                    try {
                        var key = JSON.parse(bodyLine.replace('</script>', '')).tracks[0].key;
                        getMP3(hypemId, key, callback);
                    } catch (error) {
                        // if error happens here, first check the cookie value (maybe refresh)
                        // if this is not helping, manually check the body of the request for the key value
                    }
                }
            });
        } else {
            callback(new Error("Nothing found: " + options.url), null);
        }
    });
}

function getMP3(hypemId, hypemKey, callback) {
    var options = {
        method: "GET",
        url: HYPEM_SERVE_URL + hypemId + "/" + hypemKey,
        headers: {"Cookie": COOKIE},
        timeout: FIVE_SECONDS_IN_MILLIS
    };

    request(options, function (error, response) {
        if (!error && response.statusCode === 200) {
            try {
                // the request got a json from hypem
                // where the link to the mp3 file is saved
                var jsonBody = JSON.parse(response.body);
                var mp3Url = jsonBody.url;
                callback(null, mp3Url);
            } catch (error) {
                callback(error, null);
            }

        } else {
            callback(new Error("Nothing found: " + options.url), null);
        }
    });
}

function getNormalizedSoundcloudUrl(soundcloudUrl) {
    var parsedUrl = url.parse(soundcloudUrl);
    var protocol = parsedUrl.protocol;
    var host = parsedUrl.host;
    var pathname = parsedUrl.pathname;
    var splitHostname = pathname.split('/');
    var normalizedUrl = protocol + "//" + host + "/" + splitHostname[1] + "/" + splitHostname[2];
    return normalizedUrl;
}
