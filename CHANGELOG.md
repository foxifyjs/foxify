# Changelog

## Emojis

- New Features -> :zap:
- Enhancements -> :star2:
- Breaking Changes -> :boom:
- Dependency Changes -> :package:
- Bugs -> :beetle:
- Pull Requests -> :book:
- Documents -> :mortar_board:
- Tests -> :eyeglasses:

---

## [v1.0.0](https://github.com/foxifyjs/foxify/releases/tag/v1.0.0) - _(2019-**-**)_

- :zap: Added ability to pass error to next function in route handlers
- :zap: Added request property: `protocol`
- :zap: Added request property: `secure`
- :zap: Added request property: `hostname`
- :zap: Added request property: `ips`
- :zap: Added request property: `ip`
- :zap: Added setting: `trust.proxy`
- :zap: Added setting: `jsonp.callback`
- :zap: Added setting: `etag`
- :star2: Improved setting handling
- :boom: Response `json` and `jsonp` methods no longer accept status parameter
- :beetle: Fixed assertion error handling bug
- :beetle: Fixed request query bug

## [v0.10.7](https://github.com/foxifyjs/foxify/releases/tag/v0.10.7) - _(2018-11-07)_

- :star2: Improved performance
- :star2: Better error responses
- :package: Removed [accept](https://npmjs.com/package/accept)
- :package: Removed [encodeurl](https://npmjs.com/package/encodeurl)
- :package: Removed [fast-decode-uri-component](https://npmjs.com/package/fast-decode-uri-component)
- :package: Removed [fresh](https://npmjs.com/package/fresh)
- :package: Removed [methods](https://npmjs.com/package/methods)
- :package: Removed [parseurl](https://npmjs.com/package/parseurl)
- :package: Removed [path-to-regexp](https://npmjs.com/package/path-to-regexp)
- :package: Removed [range-parser](https://npmjs.com/package/range-parser)
- :package: Removed [vary](https://npmjs.com/package/vary)

## [v0.10.3](https://github.com/foxifyjs/foxify/releases/tag/v0.10.3) - _(2018-10-22)_

- :star2: Improved performance
- :beetle: Fixed `subdomain.offset` setting
- :eyeglasses: Added tests

## [v0.10.0](https://github.com/foxifyjs/foxify/releases/tag/v0.10.0) - _(2018-10-02)_

- :zap: Added event listening ability to `Server` for custom error handlers
- :zap: Added `route` handler to `Router`
- :zap: Added param handler to `Router`
- :star2: Improved `Routing` performance (about 30% faster)

## [v0.9.0](https://github.com/foxifyjs/foxify/releases/tag/v0.9.0) - _(2018-08-21)_

- :zap: Added `subdomain.offset` setting
- :zap: Added `subdomains` getter to `http.IncomingMessage`
- :star2: Made `http` constants global by `HTTP` name
- :star2: Improved performance
- :boom: Removed `content-length` option (and content-length calculation)
- :beetle: Fixed route with prefix `use` not applying prefix bug
- :beetle: Fixed typescript usage

## [v0.8.0](https://github.com/foxifyjs/foxify/releases/tag/v0.8.0) - _(2018-07-09)_

- :zap: Added `https` option
- :zap: Added `https.key` setting
- :zap: Added `https.cert` setting
- :zap: Added json schema validation option to routing
- :zap: Added `stop` ability to server
- :zap: Added `reload` ability to server
- :star2: Improved performance

## [v0.7.0](https://github.com/foxifyjs/foxify/releases/tag/v0.7.0) - _(2018-05-19)_

- :zap: Added `content-length` option
- :boom: Moved `Database` to a new repository named [Odin](https://github.com/foxifyjs/odin)
- :star2: Improved performance

## [v0.6.0](https://github.com/foxifyjs/foxify/releases/tag/v0.6.0) - _(2018-03-26)_

- :zap: Added multiple `controller` support to `route` instance
- :zap: Added static method `dotenv` to `Foxify` class to specify `.env` file path
- :zap: Added method `of` to database type `Array`
- :zap: Added `function` support to default values in database types
- :zap: Added `graphql` support to database models
- :star2: Improved `Typescript` usage
- :star2: Improved performance

## [v0.5.1](https://github.com/foxifyjs/foxify/releases/tag/v0.5.1) - _(2018-03-10)_

- :boom: Renamed `clusters` setting into `workers`

## [v0.5.0](https://github.com/foxifyjs/foxify/releases/tag/v0.5.0) - _(2018-03-08)_

- :zap: Added clustering
- :zap: Added multiple model relations [`hasOne`, `hasMany`]
- :zap: Added multiple options [`x-powered-by`, `routing.strict`, `routing.sensitive`, `json.escape`]
- :zap: Added multiple settings [`env`, `url`, `port`, `clusters`, `json.replacer`, `json.spaces`, `query.parser`]
- :star2: Improved usage

## [v0.4.0](https://github.com/foxifyjs/foxify/releases/tag/v0.4.0) - _(2018-02-22)_

- :zap: Logging errors when `NODE_ENV` is set to `debug`
- :star2: Improved performance
- :star2: Improved error responses
- :star2: Improved database schema validation
- :beetle: Wrong database name according to model name

## [v0.3.2](https://github.com/foxifyjs/foxify/releases/tag/v0.3.2) - _(2018-02-20)_

- :star2: Improved database model schema validation
- :beetle: Database model schema validation instance
- :beetle: Default database connection when there is no `.env` file

## [v0.3.0](https://github.com/foxifyjs/foxify/releases/tag/v0.3.0) - _(2018-02-18)_

- :zap: Added simple database model schema validation
- :star2: Default database connection will be set according to `.env` file

## [v0.2.1](https://github.com/foxifyjs/foxify/releases/tag/v0.2.1) - _(2018-02-14)_

- :beetle: Encapsulation

## [v0.2.0](https://github.com/foxifyjs/foxify/releases/tag/v0.2.0) - _(2018-02-10)_

- :star2: Routing speed got doubled
- :star2: Http routing methods are accessible from app too

## [v0.1.1](https://github.com/foxifyjs/foxify/releases/tag/v0.1.1) - _(2018-02-10)_

- :beetle: Fixed #1

## [v0.1.0](https://github.com/foxifyjs/foxify/releases/tag/v0.1.0) - _(2018-02-09)_

- :tada: First Release
