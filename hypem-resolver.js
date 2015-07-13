//  Copyright 2015 Fabian Dietenberger

'use-strict';

var q = require('q'),
    request = require('request'),
    _ = require('lodash');

var hypemResolver = {};

hypemResolver.getById = function (hypemId, callback) {
    var url = "http://hypem.com/go/sc/" + hypemId;
    var options = {method: "HEAD", followRedirect: false, url: url};
    var testResultUrl = "https://soundcloud.com/griz/summer-97-ft-muzzy-bearr";

    request(options, function (err, response, body) {
        callback(testResultUrl);
        //if (err) {
        //    return testResultUrl;
        //} else {
        //    return testResultUrl;
        //}
    });
};

hypemResolver.getByUrl = function (hypemUrl, callback) {
    var trimmedUrl = _.trim(hypemUrl);
    if (_.startsWith(trimmedUrl, "http://hypem.com/track/")) {
        this.getById(hypemUrl, callback)
    } else {
        throw new Error("Hypem url is not correct. It should start with 'http://hypem.com/track/'");
    }
};

module.exports = hypemResolver;