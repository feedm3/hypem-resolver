//  Copyright 2015 Fabian Dietenberger

'use-strict';

var q = require('q'),
    request = require('request');

var hypemResolver = {};

hypemResolver.getById = function (hypemId) {
    var resultUrl = "https://soundcloud.com/griz/summer-97-ft-muzzy-bearr";
    return resultUrl;
};

hypemResolver.getByUrl = function (hypemUrl) {
    // check if it starts with http://hypem.com/track/
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