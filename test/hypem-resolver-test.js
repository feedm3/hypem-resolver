// Copyright 2015 Fabian Dietenberger

var should = require('chai').should(),
    hypemResolver = require('../hypem-resolver');

var hypemIdStandard = "2c87x",
    hypemUrlStandard = "http://hypem.com/track/2c87x",
    soundcloudUrlStandard = "http://soundcloud.com/griz/summer-97-ft-muzzy-bearr",
    hypemIdNoSong = "2c96b",
    hypemIdMp3 = "2c2k1",
    mp3 = "http://poponandon.com/wp-content/uploads/2015/06/01-Hurricane-Arty-Remix.mp3";

describe('If the hypem id is given', function () {
    this.timeout(10000);

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

    describe('and the song is hosted as mp3', function () {
        it('should contain a mp3 url', function (done) {
            hypemResolver.getById(hypemIdMp3, function (err, mp3Url) {
                mp3Url.should.be.a('string');
                mp3Url.should.equal(mp3);
                done();
            });
        });

        it('should not contain an error', function (done) {
            hypemResolver.getById(hypemIdMp3, function (err) {
                should.not.exist(err);
                done();
            })
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
    });

    describe('but the id does not exist', function () {
        it('should contain an error', function (done) {
            hypemResolver.getById("d", function (err) {
                err.should.have.property('message');
                err.message.should.be.a('string');
                done();
            })
        });
    });

    describe('but the id is empty', function () {
        it('should contain an error', function (done) {
            hypemResolver.getById(null, function (err) {
                err.should.have.property('message');
                err.message.should.be.a('string');
                done();
            })
        })
    });

    describe('but the id is a url path', function () {
        it('should contain an error', function (done) {
            hypemResolver.getById("oh/my/gosh", function (err) {
                err.should.have.property('message');
                err.message.should.be.a('string');
                done();
            })
        })
    });

    describe('but the id is not an id', function () {
        it('should contain an error', function (done) {
            hypemResolver.getById(":P #~d^1234 d", function (err) {
                err.should.have.property('message');
                err.message.should.be.a('string');
                done();
            })
        })
    });
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

    describe('but the url is longer than usual', function () {
        it('should return the correct id', function (done) {
            var hypemId = hypemResolver.urlToId(hypemUrlStandard + "/dhtzfh/hdgrd");
            hypemId.should.be.a('string');
            hypemId.should.equal(hypemIdStandard);
            done();
        });
    });

    describe('but the url is not a valid url', function () {
        it('should return an empty string', function (done) {
            var hypemId = hypemResolver.urlToId("this_id_does_not_exist");
            hypemId.should.be.a('string');
            hypemId.should.have.length(0);
            done();
        });
    });
});