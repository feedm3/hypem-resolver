//  Copyright 2015 Fabian Dietenberger

'use-strict'

var q = require('q'),
    request = require('request');

var hypemResolver = {};

hypemResolver.getByUrl = function (hypemUrl) {
    var resultUrl = "";
    return resultUrl;
};

hypemResolver.getById = function (hypemId) {
    return this.getByUrl("http://hypem.com/track/" + hypemId);
};

module.exports = hypemResolver;