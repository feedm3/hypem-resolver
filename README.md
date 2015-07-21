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

```js
var hypemResolver = require('hypem-resolver')
```


Convert the hypem id to the songs url

```js
hypemResolver.getById('2c2k1', function (error, url) {
    if (!error) {
        console.log('The url is ' + url);
    }
});
```

The hypem id is in the the url of a hypem track. 
You get the track url when you click on the songs title on the hypem site.
You can than convert/extract the url to the id.

```js
var hypemId = hypemResolver.urlToId('http://hypem.com/track/2c87x');
console.log('The id is ' + hypemId);
```
