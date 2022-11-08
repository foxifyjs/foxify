# Fresh <!-- omit in toc -->

[![NPM Version][npm-image]][npm-url]
[![Node Version][node-version-image]][node-version-url]
[![TypeScript Version][typescript-version-image]][typescript-version-url]
[![Tested With Jest][jest-image]][jest-url]
[![Pull Requests][pulls-image]][pulls-url]
[![License][license-image]][license-url]
[![Package Quality][quality-image]][quality-url]
[![Dependencies Status][dependency-status-image]][dependency-status-url]
[![NPM Total Downloads][total-downloads-image]][total-downloads-url]
[![NPM Monthly Downloads][monthly-downloads-image]][monthly-downloads-url]
[![Github Stars][stars-image]][stars-url]
[![Github Forks][forks-image]][forks-url]

HTTP response freshness testing

## Table of Contents

- [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Usage](#usage)
- [Known Issues](#known-issues)
- [Example](#example)
    - [API usage](#api-usage)
    - [Using with Node.js http server](#using-with-nodejs-http-server)
- [Versioning](#versioning)
- [Changelog](#changelog)
- [Authors](#authors)
- [License](#license)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/download) 8 or higher is required.

### Installation

```bash
npm i @foxify/fresh
```

### Usage

- TypeScript:

```typescript
import fresh from "@foxify/fresh";
```

- JavaScript:

```javascript
const fresh = require("@foxify/fresh").default;
```

Check freshness of the response using request and response headers.

When the response is still "fresh" in the client's cache `true` is
returned, otherwise `false` is returned to indicate that the client
cache is now stale and the full response should be sent.

When a client sends the `Cache-Control: no-cache` request header to
indicate an end-to-end reload request, this module will return `false`
to make handling these requests transparent.

## Known Issues

This module is designed to only follow the HTTP specifications, not
to work-around all kinda of client bugs (especially since this module
typically does not receive enough information to understand what the
client actually is).

There is a known issue that in certain versions of Safari, Safari
will incorrectly make a request that allows this module to validate
freshness of the resource even when Safari does not have a
representation of the resource in the cache. The module
[jumanji](https://www.npmjs.com/package/jumanji) can be used in
an Express application to work-around this issue and also provides
links to further reading on this Safari bug.

## Example

### API usage

```typescript
const reqHeaders = { "if-none-match": '"foo"' };
const resHeaders = { etag: '"bar"' };
fresh(reqHeaders, resHeaders);
// => false

const reqHeaders = { "if-none-match": '"foo"' };
const resHeaders = { etag: '"foo"' };
fresh(reqHeaders, resHeaders);
// => true
```

### Using with Node.js http server

```typescript
import fresh from "@foxify/fresh";
import http from "http";

const server = http.createServer((req, res) => {
  // perform server logic
  // ... including adding ETag / Last-Modified response headers

  if (isFresh(req, res)) {
    // client has a fresh copy of resource
    res.statusCode = 304;
    return res.end();
  }

  // send the resource
  res.statusCode = 200;
  res.end("hello, world!");
});

function isFresh(req, res) {
  return fresh(req.headers, {
    etag: res.getHeader("ETag"),
    "last-modified": res.getHeader("Last-Modified"),
  });
}

server.listen(3000);
```

## Versioning

We use [SemVer](http://semver.org) for versioning. For the versions available, see the [tags on this repository](https://github.com/foxifyjs/fresh/tags).

## Changelog

See the [CHANGELOG.md](CHANGELOG.md) file for details

## Authors

- [**Ardalan Amini**](https://ardalanamini.com) - _Core Maintainer_ - [@ardalanamini](https://github.com/ardalanamini)

See also the list of [contributors](https://github.com/foxifyjs/fresh/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

[npm-image]: https://img.shields.io/npm/v/@foxify/fresh.svg
[npm-url]: https://www.npmjs.com/package/@foxify/fresh
[node-version-image]: https://img.shields.io/node/v/@foxify/fresh.svg
[node-version-url]: https://nodejs.org
[typescript-version-image]: https://img.shields.io/npm/types/@foxify/fresh.svg
[typescript-version-url]: https://www.typescriptlang.org
[jest-image]: https://img.shields.io/badge/tested_with-jest-99424f.svg
[jest-url]: https://github.com/facebook/jest
[pulls-image]: https://img.shields.io/badge/PRs-Welcome-brightgreen.svg
[pulls-url]: https://github.com/foxifyjs/foxify/pulls
[license-image]: https://img.shields.io/github/license/foxifyjs/fresh.svg
[license-url]: https://github.com/foxifyjs/foxify/blob/main/packages/fresh/LICENSE
[quality-image]: http://npm.packagequality.com/shield/%40foxify%2Ffresh.svg
[quality-url]: http://packagequality.com/#?package=@foxify/fresh
[dependency-status-image]: https://david-dm.org/foxifyjs/fresh.svg
[dependency-status-url]: https://david-dm.org/foxifyjs/fresh
[total-downloads-image]: https://img.shields.io/npm/dt/@foxify/fresh.svg
[total-downloads-url]: https://www.npmjs.com/package/@foxify/fresh
[monthly-downloads-image]: https://img.shields.io/npm/dm/@foxify/fresh.svg
[monthly-downloads-url]: https://www.npmjs.com/package/@foxify/fresh
[stars-image]: https://img.shields.io/github/stars/foxifyjs/foxify.svg?style=social
[stars-url]: https://github.com/foxifyjs/foxify
[forks-image]: https://img.shields.io/github/forks/foxifyjs/fresh.svg?style=social&label=Fork
[forks-url]: https://github.com/foxifyjs/foxify
