//  Copyright 2015 Fabian Dietenberger

'use-strict';

var q = require('q'),
    request = require('request'),
    _ = require('lodash');

var hypemResolver = {};

hypemResolver.getById = function (hypemId) {
    var resultUrl = "https://soundcloud.com/griz/summer-97-ft-muzzy-bearr";
    return resultUrl;
};

hypemResolver.getByUrl = function (hypemUrl) {
    var trimmedUrl = _.trim(hypemUrl);
    if (_.startsWith(trimmedUrl, "http://hypem.com/track/")) {
        return this.getById();
    } else {
        throw new Error("Hypem url is not correct. It should start with 'http://hypem.com/track/'");
    }
};

hypemResolver.getByIdAsync = function (hypemId, callback) {
    process.nextTick(function () {
        callback(hypemResolver.getById(hypemId));
    });
};

hypemResolver.getByUrlAsync = function (hypemUrl, callback) {
    process.nextTick(function () {
        callback(hypemResolver.getByUrl(hypemUrl));
    });
};


module.exports = hypemResolver;