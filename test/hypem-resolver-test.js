// Copyright 2015 Fabian Dietenberger

var should = require('chai').should(),
    hypemResolver = require('../hypem-resolver');

var grizHypemId = "2c87x",
    grizHypemUrl = "http://hypem.com/track/2c87x",
    grizSoundcloudUrl = "https://soundcloud.com/griz/summer-97-ft-muzzy-bearr";

describe('The song is hosted on soundcloud', function () {

    describe('if the hypem id is given', function () {

        it('should return a soundcloud url', function (done) {
            var soundcloudUrl = hypemResolver.getById(grizHypemId);
            soundcloudUrl.should.be.a('string');
            soundcloudUrl.should.equal(grizSoundcloudUrl);
            done();
        });

        it('should also return a soundcloud url async', function (done) {
            hypemResolver.getByIdAsync(grizHypemId, function (soundcloudUrl) {
                soundcloudUrl.should.be.a('string');
                soundcloudUrl.should.equal(grizSoundcloudUrl);
                done();
            });
        })
    });

    describe('if the hypem url is given', function () {
        it('should return a soundcloud url', function (done) {
            var soundcloudUrl = hypemResolver.getByUrl(grizHypemUrl);
            soundcloudUrl.should.be.a('string');
            soundcloudUrl.should.equal(grizSoundcloudUrl);
            done();
        });

        it('should ignore leading and ending whitspace', function (done) {
            var soundcloudUrl = hypemResolver.getByUrl("    " + grizHypemUrl + "   ");
            soundcloudUrl.should.be.a('string');
            soundcloudUrl.should.equal(grizSoundcloudUrl);
            done();
        });

        it('should throw an error if the url is incorrect', function (done) {
            (function () {
                hypemResolver.getByUrl("dfesfessfe");
            }).should.throw();
            done();
        });

        it('should also return a soundcloud url async', function (done) {
            hypemResolver.getByUrlAsync(grizHypemUrl, function (soundcloudUrl) {
                soundcloudUrl.should.be.a('string');
                soundcloudUrl.should.equal(grizSoundcloudUrl);
                done();
            });
        })
    })
});

