# Foxify [![Tweet](https://img.shields.io/twitter/url/http/shields.io.svg?style=social)](https://twitter.com/intent/tweet?text=Foxify,%20The%20fast,%20easy%20to%20use%20%26%20typescript%20ready%20web%20framework%20for%20Node.js&url=https://github.com/foxifyjs/foxify&via=foxifyjs&hashtags=foxify,nodejs,web,api,framework,typescript,developers,fast) [![Twitter Follow](https://img.shields.io/twitter/follow/foxifyjs.svg?style=social&label=Follow)](https://twitter.com/foxifyjs)

The **fast**, **easy to use** & **typescript ready** web framework for [Node.js][NODEJS_WEBSITE].

_Inspired by [Express](https://expressjs.com) & [Fastify](https://www.fastify.io)._

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

An efficient server implies a lower cost of the infrastructure, a better responsiveness under load and happy users. How
can you efficiently handle the resources of your server, knowing that you are serving the highest number of requests as
possible, without sacrificing security validations and handy development?

Enter Foxify. Foxify is a web framework highly focused on providing the best developer experience with the least
overhead and a powerful plugin architecture. It is inspired by Fastify and Express and as far as we know, it is one of
the fastest web frameworks in town.

## Table of Content

- [Getting Started](#getting-started)
    - [Installation](#installation)
        - [NPM](#npm)
        - [PNPM](#pnpm)
        - [Yarn](#yarn)
    - [Usage](#usage)
- [Features](#features)
- [Benchmarks](#benchmarks)
- [Credits](#credits)
    - [Authors](#authors)
    - [Contributors](#contributors)
    - [Sponsors](#sponsors)
    - [Backers](#backers)
- [Versioning](#versioning)
- [License](#license)

## Getting Started

### Installation

#### NPM

```shell
npm i foxify
```

#### PNPM

```shell
pnpm add foxify
```

#### Yarn

```shell
yarn add foxify
```

### Usage

```typescript
import { HttpException } from "@foxify/http";
import Foxify from "foxify";

const app = new Foxify();

app.get("/", (req, res) => res.json({ hello: "world" }));

// create an error
app.get("/error", (req, res) => {
  throw new Error("I Failed :(");
});

// create an http error
app.get("/404", (req, res) => {
  throw new HttpException("Not Found", 404);
});

app.start();
```

More detailed [sample](https://github.com/foxifyjs/foxify/tree/main/demo) is available.

You can also find all the documents [here][DOCUMENTS_URL].

## Features

- Written in ES6
- Robust routing (about 60% faster than `Express`, almost as fast as `Fastify`)
- `Express` middleware support
- Robust database modeling ([`Odin`](https://github.com/foxifyjs/odin))
- Simple and powerful error handling
- Focus on high performance
- HTTP helpers (redirection, etc)
- View system supporting lots of template engines
- Content negotiation
- Executable for generating applications quickly
- Error handling

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

[NPM_VERSION_BADGE]: https://img.shields.io/npm/v/foxify.svg

[NPM_MONTHLY_DOWNLOAD_BADGE]: https://img.shields.io/npm/dm/foxify.svg

[NPM_TOTAL_DOWNLOAD_BADGE]: https://img.shields.io/npm/dt/foxify.svg

[NODEJS_VERSION_BADGE]: https://img.shields.io/node/v/foxify.svg

[CODE_COVERAGE_BADGE]: https://codecov.io/gh/foxifyjs/foxify/branch/main/graph/badge.svg?flag=foxify

[VULNERABILITIES_BADGE]: https://snyk.io/test/github/foxifyjs/foxify/badge.svg?targetFile=packages/foxify/package.json

[LICENSE_BADGE]: https://img.shields.io/npm/l/foxify

[TYPES_BADGE]: https://img.shields.io/npm/types/foxify.svg

[NPM_PACKAGE_URL]: https://www.npmjs.com/package/foxify

[VULNERABILITIES_URL]: https://snyk.io/test/github/foxifyjs/foxify?targetFile=packages/foxify/package.json

[LICENSE_URL]: https://github.com/foxifyjs/foxify/tree/main/packages/foxify/LICENSE

[BENCHMARKS_URL]: https://github.com/foxifyjs/foxify/tree/main/benchmarks/foxify


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
