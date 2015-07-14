//  Copyright 2015 Fabian Dietenberger

"use strict";

var q = require('q'),
    request = require('request'),
    _ = require('lodash');

var hypemResolver = {},
    hypemTrackUrl = "http://hypem.com/track/",
    hypemGoUrl = "http://hypem.com/go/sc/",
    hypemServerUrl = "http://hypem.com/serve/source/",
    timeout = 5000,
    COOKIE = "__utma=1717032.393072307.1385723530.1413915594.1413918197.143; __utmz=1717032.1411373803.101.4.utmcsr=google|utmccn=(organic)|utmcmd=organic|utmctr=(not%20provided); __qca=P0-1192099176-1385723530317; hblid=fYaYEQ1S27S34nfX2t6JN4W3JOFC0CDj; olfsk=olfsk00024760656742828235; __gads=ID=f437c883a9450f76:T=1398362427:S=ALNI_MZpJh3KfFJKxg7lAgkIujTTrdzhYA; AUTH=03%3A406b2fe38a1ab80a2953869a475ff110%3A1412624464%3A1469266248%3A01-DE; __utmb=1717032.3.10.1413918197; __utmc=1717032; __utmt=1";

hypemResolver.getById = function (hypemId, callback) {
    var url = hypemGoUrl + hypemId;
    var options = {method: "HEAD", followRedirect: false, url: url, timeout: timeout};

    request(options, function (err, response) {
        if (err || response.statusCode !== 302) {
            callback(err, null);
        } else {
            var songUrl = response.headers.location;
            if (songUrl  == "http://soundcloud.com/not/found" || songUrl == "https://soundcloud.com/not/found") {
                getSongFromExternalSource(hypemId, callback);
            } else {
                callback(null, songUrl);
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
    }
    return "";
};

function getSongFromExternalSource(hypemId, callback) {
    var options = {method: "GET", url: "", headers: {"Cookie": COOKIE}, timeout: timeout};
    options.url = hypemTrackUrl + hypemId;

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
                        var hypemUrl = hypemServerUrl + hypemId + "/" + key;
                        getMP3(hypemUrl, callback);
                    } catch(e) {
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
    var options = {method: "GET", url: hypemLink, headers: {"Cookie": COOKIE}, timeout: timeout};
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