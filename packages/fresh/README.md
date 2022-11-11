# Foxify Fresh

HTTP response freshness testing.

[![Npm Version][NPM_VERSION_BADGE]][NPM_PACKAGE_URL]
[![Build Status][GITHUB_ACTIONS_BADGE]][GITHUB_ACTIONS_URL]
[![Coverage Status][CODE_COVERAGE_BADGE]][CODE_COVERAGE_URL]
[![License][LICENSE_BADGE]][LICENSE_URL]
[![Node.js Version][NODEJS_VERSION_BADGE]][NODEJS_WEBSITE]
[![Npm Monthly Downloads][NPM_MONTHLY_DOWNLOAD_BADGE]][NPM_PACKAGE_URL]
[![Npm Total Downloads][NPM_TOTAL_DOWNLOAD_BADGE]][NPM_PACKAGE_URL]
[![Known Vulnerabilities][VULNERABILITIES_BADGE]][VULNERABILITIES_URL]
[![Open Issues][OPEN_ISSUES_BADGE]][OPEN_ISSUES_URL]
[![Pull Requests][PRS_BADGE]][PRS_URL]
[![Sponsors on Open Collective][OPENCOLLECTIVE_SPONSORS_COUNT_BADGE]](#sponsors)
[![Backers on Open Collective][OPENCOLLECTIVE_BACKERS_COUNT_BADGE]](#backers)
[![Built with TypeScript][TYPES_BADGE]][TYPESCRIPT_WEBSITE]
[![Tested With Jest][JEST_BADGE]][JEST_URL]
[![Github Stars][GITHUB_STARS_BADGE]][GITHUB_PROJECT_URL]
[![Github Forks][GITHUB_FORKS_BADGE]][GITHUB_PROJECT_URL]

## Table of Contents

- [Installation](#installation)
    - [NPM](#npm)
    - [PNPM](#pnpm)
    - [Yarn](#yarn)
- [Usage](#usage)
- [Benchmarks](#benchmarks)
- [Credits](#credits)
    - [Authors](#authors)
    - [Contributors](#contributors)
    - [Sponsors](#sponsors)
    - [Backers](#backers)
- [Versioning](#versioning)
- [License](#license)

## Installation

### NPM

```shell
npm i @foxify/fresh
```

### PNPM

```shell
pnpm add @foxify/fresh
```

### Yarn

```shell
yarn add @foxify/fresh
```

## Usage

Check freshness of the response using request and response headers.

When the response is still "fresh" in the client's cache `true` is
returned, otherwise `false` is returned to indicate that the client
cache is now stale and the full response should be sent.

When a client sends the `Cache-Control: no-cache` (or `Cache-Control: max-age=0`) request header to
indicate an end-to-end reload request, this module will return `false`
to make handling these requests transparent.

```typescript
import fresh from "@foxify/fresh";

const reqHeaders = { "if-none-match": '"foo"' };
const resHeaders = { etag: '"bar"' };

fresh(reqHeaders, resHeaders); // => false
```

```typescript
import fresh from "@foxify/fresh";

const reqHeaders = { "if-none-match": '"foo"' };
const resHeaders = { etag: '"foo"' };

fresh(reqHeaders, resHeaders); // => true
```

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

## Benchmarks

Benchmarks are available [here][BENCHMARKS_URL]

## Credits

### Authors

- [**Ardalan Amini**](https://ardalanamini.com) - *Core Maintainer* - [@ardalanamini](https://github.com/ardalanamini)

### Contributors

This project exists thanks to all the people who
contribute. [[Contribute][CONTRIBUTORS_GUIDE_URL]].

[![Contributors][CONTRIBUTORS_BADGE]][CONTRIBUTORS_URL]

_Made with [contrib.rocks](https://contrib.rocks)._

### Sponsors

Support Foxify by becoming a sponsor. Your logo will show up
here. [[Become a sponsor][OPENCOLLECTIVE_SPONSOR_URL]]

[![Sponsors][OPENCOLLECTIVE_SPONSORS_BADGE]][OPENCOLLECTIVE_SPONSORS_URL]

### Backers

Thanks to all Foxify backers! [[Become a backer][OPENCOLLECTIVE_BACKER_URL]]

[![Backers][OPENCOLLECTIVE_BACKERS_BADGE]][OPENCOLLECTIVE_BACKERS_URL]

## Versioning

We use [SemVer][SEMVER_WEBSITE] for versioning. For the versions available, see
the [releases on this repository][RELEASES_URL].

## License

This project is licensed under the _[MIT License][LICENSE_URL]_.


<!-- Package Links -->

[NPM_VERSION_BADGE]: https://img.shields.io/npm/v/@foxify/fresh.svg

[NPM_MONTHLY_DOWNLOAD_BADGE]: https://img.shields.io/npm/dm/@foxify/fresh.svg

[NPM_TOTAL_DOWNLOAD_BADGE]: https://img.shields.io/npm/dt/@foxify/fresh.svg

[NODEJS_VERSION_BADGE]: https://img.shields.io/node/v/@foxify/fresh.svg

[CODE_COVERAGE_BADGE]: https://codecov.io/gh/foxifyjs/foxify/branch/main/graph/badge.svg?flag=fresh

[VULNERABILITIES_BADGE]: https://snyk.io/test/github/foxifyjs/foxify/badge.svg?targetFile=packages/fresh/package.json

[LICENSE_BADGE]: https://img.shields.io/npm/l/@foxify/fresh

[TYPES_BADGE]: https://img.shields.io/npm/types/@foxify/fresh.svg

[NPM_PACKAGE_URL]: https://www.npmjs.com/package/@foxify/fresh

[VULNERABILITIES_URL]: https://snyk.io/test/github/foxifyjs/foxify?targetFile=packages/fresh/package.json

[LICENSE_URL]: https://github.com/foxifyjs/foxify/tree/main/packages/fresh/LICENSE

[BENCHMARKS_URL]: https://github.com/foxifyjs/foxify/tree/main/benchmarks/fresh


<!-- Project Links -->

[GITHUB_ACTIONS_BADGE]: https://github.com/foxifyjs/foxify/workflows/Test/badge.svg

[GITHUB_STARS_BADGE]: https://img.shields.io/github/stars/foxifyjs/foxify.svg?style=social&label=Stars

[GITHUB_FORKS_BADGE]: https://img.shields.io/github/forks/foxifyjs/foxify.svg?style=social&label=Fork

[OPEN_ISSUES_BADGE]: https://img.shields.io/github/issues-raw/foxifyjs/foxify.svg

[PRS_BADGE]: https://img.shields.io/badge/PRs-Welcome-brightgreen.svg

[OPENCOLLECTIVE_SPONSORS_COUNT_BADGE]: https://opencollective.com/foxify/sponsors/badge.svg

[OPENCOLLECTIVE_SPONSORS_BADGE]: https://opencollective.com/foxify/sponsors.svg?width=890

[OPENCOLLECTIVE_BACKERS_COUNT_BADGE]: https://opencollective.com/foxify/backers/badge.svg

[OPENCOLLECTIVE_BACKERS_BADGE]: https://opencollective.com/foxify/backers.svg?width=890

[CONTRIBUTORS_BADGE]: https://contrib.rocks/image?repo=foxifyjs/foxify

[CODE_COVERAGE_URL]: https://codecov.io/gh/foxifyjs/foxify

[DOCUMENTS_URL]: https://foxify.js.org

[RELEASES_URL]: https://github.com/foxifyjs/foxify/releases

[GITHUB_PROJECT_URL]: https://github.com/foxifyjs/foxify

[GITHUB_ACTIONS_URL]: https://github.com/foxifyjs/foxify/actions

[OPEN_ISSUES_URL]: https://github.com/foxifyjs/foxify/issues?q=is%3Aopen+is%3Aissue

[PRS_URL]: https://github.com/foxifyjs/foxify/pulls

[CONTRIBUTORS_URL]: https://github.com/foxifyjs/foxify/graphs/contributors

[CONTRIBUTORS_GUIDE_URL]: https://github.com/foxifyjs/foxify/tree/main/CONTRIBUTING.md

[OPENCOLLECTIVE_SPONSORS_URL]: https://opencollective.com/foxify#sponsors

[OPENCOLLECTIVE_SPONSOR_URL]: https://opencollective.com/foxify#sponsor

[OPENCOLLECTIVE_BACKERS_URL]: https://opencollective.com/foxify#backers

[OPENCOLLECTIVE_BACKER_URL]: https://opencollective.com/foxify#backer


<!-- Other Links -->

[JEST_BADGE]: https://img.shields.io/badge/tested_with-jest-99424f.svg

[JEST_URL]: https://jestjs.io

[NODEJS_WEBSITE]: https://nodejs.org

[TYPESCRIPT_WEBSITE]: https://www.typescriptlang.org

[SEMVER_WEBSITE]: http://semver.org
