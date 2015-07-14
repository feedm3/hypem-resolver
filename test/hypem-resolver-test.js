// Copyright 2015 Fabian Dietenberger

var should = require('chai').should(),
    hypemResolver = require('../hypem-resolver');

var grizHypemId = "2c87x",
    grizHypemUrl = "http://hypem.com/track/2c87x",
    grizSoundcloudUrl = "http://soundcloud.com/griz/summer-97-ft-muzzy-bearr";

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
});

describe('Converting the hypem url to the id', function () {
    it('should return the id', function (done) {
        var hypemId = hypemResolver.urlToId(grizHypemUrl);
        hypemId.should.be.a('string');
        hypemId.should.equal(grizHypemId);
        done();
    });

    it('should ignore leading and ending whitspace', function (done) {
        var hypemId = hypemResolver.urlToId("    " + grizHypemUrl + "    ");
        hypemId.should.be.a('string');
        hypemId.should.equal(grizHypemId);
        done();
    });
});