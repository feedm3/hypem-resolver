# hypem-resolver

[![npm version](https://img.shields.io/npm/v/hypem-resolver.svg?style=flat-square)](http://badge.fury.io/js/hypem-resolver)
[![Build Status](https://img.shields.io/travis/feedm3/hypem-resolver.svg?style=flat-square)](https://travis-ci.org/feedm3/hypem-resolver)
[![Test Coverage](https://img.shields.io/codeclimate/coverage/github/feedm3/hypem-resolver.svg?style=flat-square)](https://codeclimate.com/github/feedm3/hypem-resolver/coverage)
[![Code Climate](https://img.shields.io/codeclimate/github/feedm3/hypem-resolver.svg?style=flat-square)](https://codeclimate.com/github/feedm3/hypem-resolver)
[![Dependency Status](https://david-dm.org/feedm3/hypem-resolver.svg?style=flat-square)](https://david-dm.org/feedm3/hypem-resolver)
[![Actively Maintained](https://img.shields.io/badge/Actively%20Maintained-%E2%9C%94-brightgreen.svg?style=flat-square)](https://img.shields.io/badge/Actively%20Maintained-%E2%9C%94-brightgreen.svg?style=flat-square)

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
        console.error("Error " + error.message)
    }
});

// you can also use promises instead of callbacks
hypemResolver.getByIdPromise('2c87x')
    .then(function (url) {
        console.log('The url is ' + url);
    })
    .catch(function (error) {
        console.error("Error" + error.message);
    });
```

There's also a little helper method to extract the hypem id from the song's url.

```js
var hypemId = hypemResolver.urlToId('http://hypem.com/track/2c87x');
console.log('The id is ' + hypemId); // hypemId = 2c87x
```

## Contribute
If you want to contribute make sure all tests pass and the test coverage is always over 90%. 

There are 3 possible commands to run the tests. All will execute the same tests.

* The basic command will run all tests and also generate a cover report (under '/coverage'):

    `npm test`

* To do the same as the basic command but on a windows machine use the following command:

    `npm run test-win`

* You can also run the test with a watcher. This works on all platforms and does not generate
a cover report:

    `npm run test-watch`
