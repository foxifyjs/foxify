# Foxify Config

Foxify framework config.

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

## Table of Content

- [Installation](#installation)
    - [NPM](#npm)
    - [PNPM](#pnpm)
    - [Yarn](#yarn)
- [Usage](#usage)
    - [ECMAScript](#ecmascript)
    - [CommonJS](#commonjs)
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
npm i @foxify/config
```

### PNPM

```shell
pnpm add @foxify/config
```

### Yarn

```shell
yarn add @foxify/config
```

## Usage

Create the `foxify.config.js` file at the root of your project. (Optional)

> In case of the config file missing, the default values will be used.

|       Config       |                              Type                              |                 Default                 |                                                                          Description                                                                           |
|:------------------:|:--------------------------------------------------------------:|:---------------------------------------:|:--------------------------------------------------------------------------------------------------------------------------------------------------------------:|
|       `env`        |              `production`, `development`, `test`               | `process.env.NODE_ENV` or `development` |                                                                      Node.js environment.                                                                      |
|    `xPoweredBy`    |                            Boolean                             |                 `true`                  |                                             Indicates whether the `X-Powered-By` header should be present or not.                                              |
|     `workers`      |          Integer between `1` and number of cpu cores           |                   `1`                   |                             Number of Node.js cluster workers to be created. In case of `1` Node.js cluster workers won't be used.                             |
|       `etag`       | `(body: string / Buffer, encoding?: BufferEncoding) => string` |                    -                    |                                                             ETag response header value generator.                                                              |
|      `server`      |                             Object                             |                    -                    |                                                                         Server config.                                                                         |
| `server.protocol`  |                        `http`, `https`                         |                 `http`                  |                                                                        Server protocol.                                                                        |
| `server.hostname`  |                             String                             |               `localhost`               |                                                                        Server hostname.                                                                        |
|   `server.port`    |                Integer between `0` and `65535`                 |                 `3000`                  |                                                                          Server port.                                                                          |
|    `subdomain`     |                             Object                             |                    -                    |                                                                       Subdomain config.                                                                        |
| `subdomain.offset` |                      Non-negative integer                      |                   `2`                   |                                          The number of dot-separated parts of the host to remove to access subdomain.                                          |
|       `json`       |                             Object                             |                    -                    |                                                                          JSON config.                                                                          |
|   `json.escape`    |                            Boolean                             |                 `false`                 |                                     Enable escaping JSON responses from the `res.json`, `res.jsonp`, and `res.send` APIs.                                      |
|  `json.replacer`   |           `(key: string, value: unknown) => unknown`           |                    -                    |                                                       The `replacer` argument used by `JSON.stringify`.                                                        |
|   `json.spaces`    |                      Non-negative integer                      |                   `0`                   |                 The `space` argument used by `JSON.stringify`. This is typically set to the number of spaces to use to indent prettified JSON.                 |
|      `jsonp`       |                             Object                             |                    -                    |                                                                         JSONP config.                                                                          |
|  `jsonp.callback`  |                             String                             |               `callback`                |                                                                    The JSONP callback name.                                                                    |
|      `query`       |                             Object                             |                    -                    |                                                                  Request query string config.                                                                  |
|   `query.parser`   |         `(queryString: string) => Record<string, any>`         |               `qs.parse`                |            A custom query string parsing function will receive the complete query string, and must return an object of query keys and their values.            |
|      `proxy`       |                             Object                             |                    -                    |                                                                         Proxy config.                                                                          |
|   `proxy.trust`    |          `(ip: string, hopIndex: number) => boolean`           |              `() => false`              | Indicates whether the app is behind a front-facing proxy, and to use the `X-Forwarded-*` headers to determine the connection and the IP address of the client. |

> The exported config values are frozen using `Object.freeze`.

### ECMAScript

Config file contents (`foxify.config.js`):

```typescript
export default {
  env: "development",
  xPoweredBy: true,
  workers: 1,
  server: {
    protocol: "http",
    hostname: "localhost",
    port: 3000,
  },
  subdomain: {
    offset: 2,
  },
  json: {
    escape: false,
    spaces: 0,
  },
  jsonp: {
    callback: "callback",
  },
  query: {
    parser: qs.parse,
  },
  proxy: {
    trust: () => false,
  },
};
```

Consume the config values:

```typescript
import config from "@foxify/config";
```

### CommonJS

Config file contents (`foxify.config.js`):

```typescript
module.exports = {
  env: "development",
  xPoweredBy: true,
  workers: 1,
  server: {
    protocol: "http",
    hostname: "localhost",
    port: 3000,
  },
  subdomain: {
    offset: 2,
  },
  json: {
    escape: false,
    spaces: 0,
  },
  jsonp: {
    callback: "callback",
  },
  query: {
    parser: qs.parse,
  },
  proxy: {
    trust: () => false,
  },
};
```

Consume the config values:

```typescript
const config = require("@foxify/config").default;
```

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

[NPM_VERSION_BADGE]: https://img.shields.io/npm/v/@foxify/config.svg

[NPM_MONTHLY_DOWNLOAD_BADGE]: https://img.shields.io/npm/dm/@foxify/config.svg

[NPM_TOTAL_DOWNLOAD_BADGE]: https://img.shields.io/npm/dt/@foxify/config.svg

[NODEJS_VERSION_BADGE]: https://img.shields.io/node/v/@foxify/config.svg

[CODE_COVERAGE_BADGE]: https://codecov.io/gh/foxifyjs/foxify/branch/main/graph/badge.svg?flag=config

[VULNERABILITIES_BADGE]: https://snyk.io/test/github/foxifyjs/foxify/badge.svg?targetFile=packages/config/package.json

[LICENSE_BADGE]: https://img.shields.io/npm/l/@foxify/config

[TYPES_BADGE]: https://img.shields.io/npm/types/@foxify/config.svg

[NPM_PACKAGE_URL]: https://www.npmjs.com/package/@foxify/config

[VULNERABILITIES_URL]: https://snyk.io/test/github/foxifyjs/foxify?targetFile=packages/config/package.json

[LICENSE_URL]: https://github.com/foxifyjs/foxify/tree/main/packages/config/LICENSE


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
