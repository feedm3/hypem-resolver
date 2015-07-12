// Copyright 2015 Fabian Dietenberger

var should = require('chai').should(),
    hypemResolver = require('../hypem-resolver');

var grizHypemId = "2c87x",
    grizHypemUrl = "http://hypem.com/track/2c87x",
    grizSoundcloudUrl = "https://soundcloud.com/griz/summer-97-ft-muzzy-bearr";

describe('Get the songs URL with the hypem ID', function () {
    describe('if the song is hosted on soundcloud', function () {
        it('should return a soundcloud url', function (done) {
            var soundcloudUrl = hypemResolver.getById(grizHypemId);
            soundcloudUrl.should.be.a('string');
            soundcloudUrl.should.equal(grizSoundcloudUrl);
            done();
        })
    });
});

describe('Get the songs URL with the hypem URL', function () {
    describe('if the song is hosted on soundcloud', function () {
        it('should return a soundcloud url', function (done) {
            var soundcloudUrl = hypemResolver.getByUrl(grizHypemUrl);
            soundcloudUrl.should.be.a('string');
            soundcloudUrl.should.equal(grizSoundcloudUrl);
            done();
        })
    });
});

describe('Get the songs URL with the hypem ID async', function () {
    describe('if the song is hosted on soundcloud', function () {
        it('should return a soundcloud url', function (done) {
            hypemResolver.getByIdAsync(grizHypemId, function (soundcloudUrl) {
                soundcloudUrl.should.be.a('string');
                soundcloudUrl.should.equal(grizSoundcloudUrl);
                done();
            });
        })
    });
});

describe('Get the songs URL with the hypem URL async', function () {
    describe('if the song is hosted on soundcloud', function () {
        it('should return a soundcloud url', function (done) {
            hypemResolver.getByUrlAsync(grizHypemUrl, function (soundcloudUrl) {
                soundcloudUrl.should.be.a('string');
                soundcloudUrl.should.equal(grizSoundcloudUrl);
                done();
            });
        })
    });
});
