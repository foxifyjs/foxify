# Foxify Config

Foxify framework config

[![Build Status](https://github.com/foxifyjs/foxify/workflows/Test/badge.svg)](https://github.com/foxifyjs/foxify/actions)
[![Coverage Status](https://codecov.io/gh/foxifyjs/foxify/branch/main/graph/badge.svg?flag=config)](https://codecov.io/gh/foxifyjs/foxify)

## Table of Content

- [Installation](#installation)
  - [NPM](#npm)
  - [PNPM](#pnpm)
  - [Yarn](#yarn)
- [Usage](#usage)
  - [ECMAScript](#ecmascript)
  - [CommonJS](#commonjs)
- [Versioning](#versioning)
- [Authors](#authors)
- [License](#license)

## Installation

> In case of using GitHub package registry,
> the package name will be `@foxifyjs/config`.

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

## Versioning

We use [SemVer][SEMVER_URL] for versioning. For the versions available, see
the [releases on this repository][RELEASE_URL].

## Authors

- **Ardalan Amini** - _Core Maintainer_ - [@ardalanamini](https://github.com/ardalanamini)

See also the list of [contributors][CONTRIBUTORS_URL] who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE][LICENSE_URL] file for details

<!-- Links -->

[SEMVER_URL]: http://semver.org

[RELEASE_URL]: https://github.com/foxifyjs/foxify/releases

[CONTRIBUTORS_URL]: https://github.com/foxifyjs/foxify/contributors

[LICENSE_URL]: https://github.com/foxifyjs/foxify/blob/main/packages/config/LICENSE
