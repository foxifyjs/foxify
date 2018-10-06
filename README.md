# Foxify [![Tweet](https://img.shields.io/twitter/url/http/shields.io.svg?style=social)](https://twitter.com/intent/tweet?text=Foxify,%20The%20fast,%20easy%20to%20use%20%26%20typescript%20ready%20web%20framework%20for%20Node.js&url=https://github.com/foxifyjs/foxify&via=foxifyjs&hashtags=foxify,nodejs,web,api,framework,typescript,developers,fast) [![Twitter Follow](https://img.shields.io/twitter/follow/foxifyjs.svg?style=social&label=Follow)](https://twitter.com/foxifyjs)

The **fast**, **easy to use** & **typescript ready** web framework for [Node.js](https://nodejs.org)

> Inspired by [Express](https://expressjs.com) & [Fastify](https://www.fastify.io/)

[![Npm Version](https://img.shields.io/npm/v/foxify.svg)](https://www.npmjs.com/package/foxify)
[![Node Version](https://img.shields.io/node/v/foxify.svg)](https://nodejs.org)
[![TypeScript Version](https://img.shields.io/npm/types/foxify.svg)](https://www.typescriptlang.org)
[![Package Quality](https://npm.packagequality.com/shield/foxify.svg)](https://packagequality.com/#?package=foxify)
[![Npm Total Downloads](https://img.shields.io/npm/dt/foxify.svg)](https://www.npmjs.com/package/foxify)
[![Npm Monthly Downloads](https://img.shields.io/npm/dm/foxify.svg)](https://www.npmjs.com/package/foxify)
[![Open Issues](https://img.shields.io/github/issues-raw/foxifyjs/foxify.svg)](https://github.com/foxifyjs/foxify/issues?q=is%3Aopen+is%3Aissue)
[![Closed Issues](https://img.shields.io/github/issues-closed-raw/foxifyjs/foxify.svg)](https://github.com/foxifyjs/foxify/issues?q=is%3Aissue+is%3Aclosed)
[![Known Vulnerabilities](https://snyk.io/test/github/foxifyjs/foxify/badge.svg?targetFile=package.json)](https://snyk.io/test/github/foxifyjs/foxify?targetFile=package.json)
[![Dependencies Status](https://david-dm.org/foxifyjs/foxify.svg)](https://david-dm.org/foxifyjs/foxify)
[![Pull Requests](https://img.shields.io/badge/PRs-Welcome-brightgreen.svg)](https://github.com/foxifyjs/foxify/pulls)
[![License](https://img.shields.io/github/license/foxifyjs/foxify.svg)](https://github.com/foxifyjs/foxify/blob/master/LICENSE)
[![Build Status](https://api.travis-ci.com/foxifyjs/foxify.svg?branch=master)](https://travis-ci.com/foxifyjs/foxify)
[![Coverage Status](https://codecov.io/gh/foxifyjs/foxify/branch/master/graph/badge.svg)](https://codecov.io/gh/foxifyjs/foxify)
[![Github Stars](https://img.shields.io/github/stars/foxifyjs/foxify.svg?style=social&label=Stars)](https://github.com/foxifyjs/foxify)
[![Github Forks](https://img.shields.io/github/forks/foxifyjs/foxify.svg?style=social&label=Fork)](https://github.com/foxifyjs/foxify)

An efficient server implies a lower cost of the infrastructure, a better responsiveness under load and happy users. How can you efficiently handle the resources of your server, knowing that you are serving the highest number of requests as possible, without sacrificing security validations and handy development?

Enter Foxify. Foxify is a web framework highly focused on providing the best developer experience with the least overhead and a powerful plugin architecture. It is inspired by Fastify and Express and as far as we know, it is one of the fastest web frameworks in town.

## Table of Contents <!-- omit in toc -->

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Usage](#usage)
- [Features](#features)
- [Benchmarks](#benchmarks)
- [TODO](#todo)
- [Versioning](#versioning)
- [Authors](#authors)
- [License](#license)
- [Support](#support)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/download) 8 or higher is required.

### Installation

```bash
npm i -s foxify
```

### Usage

```javascript
const Foxify = require('foxify');

let app = new Foxify();

app.get('/', (req, res) => {
    res.json({hello: 'world'});
});

// create an error
app.get('/error', (req, res) => {
    throw new Error('I Failed :(');
});

// create an http error
app.get('/404', (req, res) => {
    throw new HttpException('Not Found', 404);
});

app.start();
```

More detailed [sample](https://github.com/foxifyjs/foxify/tree/master/demo) is available.

You can also find all the documents [here](https://foxify.js.org).

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

**Machine**: Ubuntu 18.04 64-bit, Intel Core i7 (8 cores), 8GiB (DDR4)

**Method**: `autocannon -c 100 -d 40 -p 10 localhost:3000` * 2, taking the second average

**sort**: R/S

| Framework  | Version     | R/S          |
| :--------: | :---------: | :----------: |
| fastify    | 1.11.2      | 27,112       |
| **Foxify** | **0.10.0**  | **26,702.4** |
| **bare**   | **10.10.0** | **21,476.8** |
| hapi       | 17.5.4      | 19,755.2     |
| express    | 4.16.3      | 16,408.8     |
| restify    | 7.2.1       | 15,474.4     |

## TODO

- [x] Routing
- [x] Middleware support
- [x] Error handling
- [x] View engine
- [x] Options
- [x] Settings
- [x] Database Model ([`Odin`](https://github.com/foxifyjs/odin))
- [x] Clustering
- [ ] File storage
- [ ] Job schedule
- [ ] Logging

## Versioning

We use [SemVer](http://semver.org) for versioning. For the versions available, see the [tags on this repository](https://github.com/foxifyjs/foxify/tags).

## Authors

- **Ardalan Amini** - *Owner/Developer* - [@ardalanamini](https://github.com/ardalanamini)

See also the list of [contributors](https://github.com/foxifyjs/foxify/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## Support

If my work helps you, please consider

[![Become A Patron](https://c5.patreon.com/external/logo/become_a_patron_button.png)](https://www.patreon.com/ardalanamini)

[![Buy Me A Coffee](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/ardalanamini)
