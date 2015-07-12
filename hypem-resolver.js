//  Copyright 2015 Fabian Dietenberger

'use-strict';

var q = require('q'),
    request = require('request');

var hypemResolver = {};

hypemResolver.getByUrl = function (hypemUrl) {
    var resultUrl = "https://soundcloud.com/griz/summer-97-ft-muzzy-bearr";
    return resultUrl;
};

hypemResolver.getByUrlAsync = function (hypemUrl, callback) {
    process.nextTick(function () {
        callback(hypemResolver.getByUrl(hypemUrl));
    });
};

hypemResolver.getById = function (hypemId) {
    return this.getByUrl("http://hypem.com/track/" + hypemId);
};

hypemResolver.getByIdAsync = function (hypemId, callback) {
    process.nextTick(function () {
        callback(hypemResolver.getById(hypemId));
    });
};

module.exports = hypemResolver;