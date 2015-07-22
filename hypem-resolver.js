/**
 * Copyright 2015 Fabian Dietenberger
 * Available under MIT license
 */
function HypemResolver() {

    "use strict";

    var request = require('request'),
        url = require('url'),
        _ = require('lodash');

    /** Used for the requests */
    var FIVE_SECONDS_IN_MILLIS = 5000,
        COOKIE = "AUTH=03%3A406b2fe38a1ab80a2953869a475ff110%3A1412624464%3A1469266248%3A01-DE",
        HYPEM_TRACK_URL = "http://hypem.com/track/",
        HYPEM_GO_URL = "http://hypem.com/go/sc/",
        HYPEM_SERVE_URL = "http://hypem.com/serve/source/";

    /**
     * Extract the hypem id from a song's url.
     *
     * @param {string} hypemUrl the url to extract the id
     * @returns {string} the id or "" if no id was found
     */
    function urlToId(hypemUrl) {
        var trimmedUrl = _.trim(hypemUrl);
        if (_.startsWith(trimmedUrl, HYPEM_TRACK_URL)) {
            var parsedUrl = url.parse(hypemUrl);
            var pathname = parsedUrl.pathname; // '/trach/31jfi/...'
            var hypemId = pathname.split("/")[2];
            return hypemId;
        }
        return "";
    }

    /**
     * Get the soundcloud or mp3 url from a song's id.
     *
     * @param hypemId {string} the id of the song
     * @param {Function}[callback] callback function
     * @param {Error} callback.err null if no error occurred
     * @param {string} callback.url the soundcloud or mp3 url
     */
    function getById(hypemId, callback) {
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
                getHypemKey(hypemId, function (error, hypemKey) {
                    if (error) {
                        callback(error, null);
                    }
                    getMP3(hypemId, hypemKey, callback);
                });
            } else {
                var soundcloudUrl = getNormalizedSoundcloudUrl(songUrl);
                callback(null, soundcloudUrl);
            }
        });
    }

    return {
        urlToId: urlToId,
        getById: getById
    };

    /**
     * Get the key for hypem. The key is necessary to request
     * the hypem serve url which gives us the mp3 url. We dont
     * need a key if the song is hosted on soundcloud.
     *
     * @private
     * @param {string} hypemId the id of the song
     * @param {Function}[callback] callback function
     * @param {Error} callback.err null if no error occurred
     * @param {string} callback.url the key to request a hypem song url
     */
    function getHypemKey(hypemId, callback) {
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
                            callback(null, key);
                        } catch (error) {
                            // if an error happen here do nothing and parse
                            // the rest of the document
                        }
                    }
                });
            } else {
                callback(new Error("Nothing found: " + options.url), null);
            }
        });
    }

    /**
     * Get the mp3 url of the song's id with a given key.
     *
     * @private
     * @param {string} hypemId the id of the song
     * @param {string} hypemKey the key to make the request succeed
     * @param {Function}[callback] callback function
     * @param {Error} callback.err null if no error occurred
     * @param {string} callback.url the mp3 url
     */
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

    /**
     * Get the normalized soundcloud url. This means that every
     * parameter or path which is not necessary gets removed.
     *
     * @private
     * @param {string} soundcloudUrl the url to normalize
     * @returns {string} the normalized soundcloud url
     */
    function getNormalizedSoundcloudUrl(soundcloudUrl) {
        var parsedUrl = url.parse(soundcloudUrl);
        var protocol = parsedUrl.protocol;
        var host = parsedUrl.host;
        var pathname = parsedUrl.pathname;
        var splitHostname = pathname.split('/');
        var normalizedUrl = protocol + "//" + host + "/" + splitHostname[1] + "/" + splitHostname[2];
        return normalizedUrl;
    }
}

module.exports = new HypemResolver();

