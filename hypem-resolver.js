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
    _.startsWith(trimmedUrl, "http://hypem.com/track/");
    return this.getById();
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