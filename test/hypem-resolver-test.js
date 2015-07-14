// Copyright 2015 Fabian Dietenberger

var should = require('chai').should(),
    hypemResolver = require('../hypem-resolver');

var hypemIdStandard = "2c87x",
    hypemUrlStandard = "http://hypem.com/track/2c87x",
    soundcloudUrlStandard = "http://soundcloud.com/griz/summer-97-ft-muzzy-bearr",
    hypemIdNoSong = "2c96b";

describe('If the hypem id is given', function () {

    describe('and the song is hosted on soundcloud', function () {
        it('should contain a soundcloud url', function (done) {
            hypemResolver.getById(hypemIdStandard, function (err, soundcloudUrl) {
                soundcloudUrl.should.be.a('string');
                soundcloudUrl.should.equal(soundcloudUrlStandard);
                done();
            });
        });

        it('should not contain an error', function (done) {
            hypemResolver.getById(hypemIdStandard, function (err) {
                should.not.exist(err);
                done();
            });
        });
    });

    describe('and the song is not hosted anywhere', function () {
        it('should contain an error', function (done) {
            hypemResolver.getById(hypemIdNoSong, function (err) {
                err.should.have.property('message');
                err.message.should.be.a('string');
                done();
            })
        })
    })
});

describe('Converting the hypem url to the id', function () {
    it('should return the id', function (done) {
        var hypemId = hypemResolver.urlToId(hypemUrlStandard);
        hypemId.should.be.a('string');
        hypemId.should.equal(hypemIdStandard);
        done();
    });

    it('should ignore leading and ending whitspace', function (done) {
        var hypemId = hypemResolver.urlToId("    " + hypemUrlStandard + "    ");
        hypemId.should.be.a('string');
        hypemId.should.equal(hypemIdStandard);
        done();
    });
});