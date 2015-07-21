# hypem-resolver

[![Build Status](https://travis-ci.org/feedm3/hypem-resolver.svg)](https://travis-ci.org/feedm3/hypem-resolver)
[![Test Coverage](https://codeclimate.com/github/feedm3/hypem-resolver/badges/coverage.svg)](https://codeclimate.com/github/feedm3/hypem-resolver/coverage)
[![Code Climate](https://codeclimate.com/github/feedm3/hypem-resolver/badges/gpa.svg)](https://codeclimate.com/github/feedm3/hypem-resolver)
[![Dependency Status](https://david-dm.org/feedm3/hypem-resolver.svg)](https://david-dm.org/feedm3/hypem-resolver)

Package for Node to resolve the hypem URL to its soundcloud/mp3 link.

## Usage
Install via npm

`npm install hypem-resolver`

Require the package

`var hypemResolver = require('hypem-resolver')`

Convert the hypem id to the songs url

`hypemResolver.getById(hypemIdStandard, function (error, url) {
    if (!error) {
        console.log('The url is ' + url);
    }
});`
