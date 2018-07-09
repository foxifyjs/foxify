# Changelog

## [v0.8.0](https://github.com/foxifyjs/foxify/releases/tag/v0.8.0) - *2018-07-09*

**Implemented enhancements:**

- added `https` option
- added `https.key` setting
- added `https.cert` setting
- added `json schema` option to routing
- added `stop` ability
- added `reload` ability
- improved performance

## [v0.7.0](https://github.com/foxifyjs/foxify/releases/tag/v0.7.0) - *2018-05-19*

**Implemented enhancements:**

- added `content-length` option
- moved `Database` to a new repository named [Odin](https://github.com/foxifyjs/odin)
- improved performance

## [v0.6.0](https://github.com/foxifyjs/foxify/releases/tag/v0.6.0) - *2018-03-26*

**Implemented enhancements:**

- added multiple `controller` support to `route` instance
- added static method `dotenv` to `Foxify` class to specify `.env` file path
- added method `of` to database type `Array`
- added `function` support to default values in database types
- added `graphql` support to database models
- improved performance
- improved `Typescript` usage

## [v0.5.1](https://github.com/foxifyjs/foxify/releases/tag/v0.5.1) - *2018-03-10*

**Implemented enhancements:**

- renamed `clusters` setting into `workers`

## [v0.5.0](https://github.com/foxifyjs/foxify/releases/tag/v0.5.0) - *2018-03-08*

**Implemented enhancements:**

- added clustering
- added multiple model relations [`hasOne`, `hasMany`]
- added multiple options [`x-powered-by`, `routing.strict`, `routing.sensitive`, `json.escape`]
- added multiple settings [`env`, `url`, `port`, `clusters`, `json.replacer`, `json.spaces`, `query.parser`]
- improved usage

## [v0.4.0](https://github.com/foxifyjs/foxify/releases/tag/v0.4.0) - *2018-02-22*

**Implemented enhancements:**

- improved performance
- improved error responses
- improved database schema validation
- logging errors when `NODE_ENV` is set to `debug`

**Fixed bugs:**

- wrong database name according to model name

## [v0.3.2](https://github.com/foxifyjs/foxify/releases/tag/v0.3.2) - *2018-02-20*

**Implemented enhancements:**

- improved database model schema validation

**Fixed bugs:**

- database model schema validation instance
- default database connection when there is no `.env` file

## [v0.3.0](https://github.com/foxifyjs/foxify/releases/tag/v0.3.0) - *2018-02-18*

**Implemented enhancements:**

- added simple database model schema validation
- Default database connection will be set according to `.env` file

## [v0.2.1](https://github.com/foxifyjs/foxify/releases/tag/v0.2.1) - *2018-02-14*

**Fixed bugs:**

- Encapsulation

## [v0.2.0](https://github.com/foxifyjs/foxify/releases/tag/v0.2.0) - *2018-02-10*

**Implemented enhancements:**

- routing speed got doubled
- http routing methods are accessible from app too

## [v0.1.1](https://github.com/foxifyjs/foxify/releases/tag/v0.1.1) - *2018-02-10*

**Closed issues:**

- Fixed #1

## [v0.1.0](https://github.com/foxifyjs/foxify/releases/tag/v0.1.0) - *2018-02-09*

First Release
