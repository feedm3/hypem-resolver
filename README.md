# hypem-resolver

[![npm version](https://badge.fury.io/js/hypem-resolver.svg)](http://badge.fury.io/js/hypem-resolver)
[![Build Status](https://travis-ci.org/feedm3/hypem-resolver.svg)](https://travis-ci.org/feedm3/hypem-resolver)
[![Test Coverage](https://codeclimate.com/github/feedm3/hypem-resolver/badges/coverage.svg)](https://codeclimate.com/github/feedm3/hypem-resolver/coverage)
[![Code Climate](https://codeclimate.com/github/feedm3/hypem-resolver/badges/gpa.svg)](https://codeclimate.com/github/feedm3/hypem-resolver)
[![Dependency Status](https://david-dm.org/feedm3/hypem-resolver.svg)](https://david-dm.org/feedm3/hypem-resolver)

Package for Node to resolve a hypem song url to it's soundcloud/mp3 url.

## Usage
Install via npm

`npm install hypem-resolver`


Require the package

```js
var hypemResolver = require('hypem-resolver')
```


Convert the hypem id to the songs url

```js
// song is hosted on soundcloud (http://hypem.com/track/2c87x)
hypemResolver.getById('2c87x', function (error, url) {
    // url = http://soundcloud.com/griz/summer-97-ft-muzzy-bearr
    if (!error) {
        console.log('The url is ' + url);
    }
});

// song is hosted as mp3 somewhere else (http://hypem.com/track/2c2k1)
hypemResolver.getById('2c2k1', function (error, url) {
    // url = http://poponandon.com/wp-content/uploads/2015/06/01-Hurricane-Arty-Remix.mp3
    if (!error) {
        console.log('The url is ' + url);
    }
});

// song is not hosted anywhere (http://hypem.com/track/2c96b)
hypemResolver.getById('2c96b', function (error, url) {
    // error!
    if (!error) {
        console.log('The url is ' + url);
    } else {
        console.log("Error " + error.message)
    }
});
```

There's also a little helper method to extract the hypem id from the song's url.

```js
var hypemId = hypemResolver.urlToId('http://hypem.com/track/2c87x');
console.log('The id is ' + hypemId); // hypemId = 2c87x
```
