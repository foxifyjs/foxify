# Foxify

The **fast**, **easy to use** &amp; **typescript ready** web framework for [Node.js](https://nodejs.org)

> Inspired by [Express](https://expressjs.com)

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
[![Github Stars](https://img.shields.io/github/stars/foxifyjs/foxify.svg?style=social&label=Stars)](https://github.com/foxifyjs/foxify)
[![Github Forks](https://img.shields.io/github/forks/foxifyjs/foxify.svg?style=social&label=Fork)](https://github.com/foxifyjs/foxify)

> NOTE: before the first major version there might be so many major changes; so be warned!

## Table of Contents <!-- omit in toc -->

- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [Benchmarks](#benchmarks)
- [TODO](#todo)
- [Support](#support)

## Installation

Before installing, [download and install Node.js](https://nodejs.org/en/download).
Node.js 8 or higher is required.

```bash
npm i -s foxify
```

## Usage

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

You can also find all the documents [here](https://foxify.js.org/api.html).

## Features

- Written in ES6
- Robust routing (faster than `Express`)
- `Express` middleware support
- Robust database modeling ([Odin](https://github.com/foxifyjs/odin))
- Simple and powerful error handling
- Focus on high performance
- HTTP helpers (redirection, etc)
- View system supporting lots of template engines
- Content negotiation
- Executable for generating applications quickly

## Benchmarks

**Machine**: Intel Virtual CPU (2 cores), 2GiB (DDR4)

**Method**: `autocannon -c 100 -d 40 -p 10 localhost:3000` * 2, taking the second average

**sort**: R/S

| Framework | Version | R/S |
|:---------:|:-------:|:---:|
| `http.Server` | **10.1.0** | **71,892** |
| - | - | - |
| fastify | 1.4.0 | 70,793 |
| **Foxify** | **0.7.0** | **61,370** |
| restify | 6.4.0 | 50,616 |
| hapi | 17.4.0 | 42,384 |
| express | 4.16.3 | 41,146 |

## TODO

- [x] Routing
- [x] Middleware support
- [x] Error handling
- [x] View engine
- [x] Options
- [x] Settings
- [x] [Database Model](https://github.com/foxifyjs/odin)
- [x] Clustering
- [ ] File storage
- [ ] Job schedule
- [ ] Logging

## Support

If my work helps you, please consider

[![Become A Patron](https://c5.patreon.com/external/logo/become_a_patron_button.png)](https://www.patreon.com/ardalanamini)

[![Buy Me A Coffee](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/ardalanamini)