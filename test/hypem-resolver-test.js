// Copyright 2015 Fabian Dietenberger
var blanket = require("blanket")({
    /* options are passed as an argument object to the require statement */
    "pattern": [""],
    "data-cover-never": [ "node_modules", "test" ]
});

var should = require('chai').should(),
    hypemResolver = require('../hypem-resolver');

var grizHypemId = "2c87x",
    grizHypemUrl = "http://hypem.com/track/2c87x",
    grizSoundcloudUrl = "https://soundcloud.com/griz/summer-97-ft-muzzy-bearr";

describe('If the song is hosted on soundcloud', function () {

    describe('and the hypem id is given', function () {
        it('should return a soundcloud url', function (done) {
            hypemResolver.getById(grizHypemId, function (err, soundcloudUrl) {
                soundcloudUrl.should.be.a('string');
                soundcloudUrl.should.equal(grizSoundcloudUrl);
                done();
            });
        });

        it('should not contain an error', function (done) {
            hypemResolver.getById(grizHypemId, function (err, soundcloudUrl) {
                should.not.exist(err);
                done();
            });
        });
    });

    describe('and the hypem url is given', function () {
        it('should return a soundcloud url', function (done) {
            hypemResolver.getByUrl(grizHypemUrl, function (err, soundcloudUrl) {
                soundcloudUrl.should.be.a('string');
                soundcloudUrl.should.equal(grizSoundcloudUrl);
                done();
            });
        });

        it('should ignore leading and ending whitspace', function (done) {
            hypemResolver.getByUrl("    " + grizHypemUrl + "   ", function (err, soundcloudUrl) {
                soundcloudUrl.should.be.a('string');
                soundcloudUrl.should.equal(grizSoundcloudUrl);
                done();
            });
        });

        it('should give error if the url is incorrect', function (done) {
            hypemResolver.getByUrl("dfesfessfe", function (err, soundcloudUrl) {
                err.should.have.property('message');
                err.message.should.be.a('string');
                should.not.exist(soundcloudUrl);
                done();
            });
        });
    })
});

