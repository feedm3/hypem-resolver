// Copyright 2015 Fabian Dietenberger

var should = require('chai').should(),
    hypemResolver = require('../hypem-resolver');

describe('Use the hypem link to get the songs url', function () {
    describe('if the song is hosted on soundcloud', function () {
        it('should return a soundcloud url', function (done) {
            var soundcloudUrl = hypemResolver.getUrl('adad');
            soundcloudUrl.should.be.a('string');
            done();
        })
    });
});