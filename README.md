<div align="center">
	<a href="https://github.com/foxifyjs/foxify">
		<img src="http://res.cloudinary.com/dmny54mk6/image/upload/v1518111172/3ZIcg4.jpg" alt="foxify logo" style="width: 200px;">
	</a>
	<h1>Foxify</h1>
	<p>The <b>fast</b>, <b>easy to use</b> &amp; <b>typescript ready</b> web framework for <a href="https://nodejs.org" target="_blank">Node.js</a></p>
	<p>Inspired by <a href="https://expressjs.com" target="__blank">Express</a></p>
	<a href="https://www.npmjs.com/package/foxify" target="_blank">
		<img src="https://img.shields.io/npm/v/foxify.svg" alt="npm version">
	</a>
	<a href="https://nodejs.org" target="_blank">
		<img src="https://img.shields.io/node/v/foxify.svg" alt="node version">
	</a>
	<a href="https://www.typescriptlang.org" target="_blank">
		<img src="https://img.shields.io/npm/types/foxify.svg" alt="typescript version">
	</a>
	<a href="http://packagequality.com/#?package=foxify" target="_blank">
		<img src="http://npm.packagequality.com/shield/foxify.svg" alt="package quality">
	</a>
	<a href="https://www.npmjs.com/package/foxify" target="_blank">
		<img src="https://img.shields.io/npm/dt/foxify.svg" alt="npm downloads">
	</a>
	<a href="https://www.npmjs.com/package/foxify" target="_blank">
		<img src="https://img.shields.io/npm/dm/foxify.svg" alt="npm monthly downloads">
	</a>
	<a href="https://github.com/foxifyjs/foxify/issues?q=is%3Aopen+is%3Aissue" target="_blank">
		<img src="https://img.shields.io/github/issues-raw/foxifyjs/foxify.svg" alt="open issues">
	</a>
	<a href="https://github.com/foxifyjs/foxify/issues?q=is%3Aissue+is%3Aclosed" target="_blank">
		<img src="https://img.shields.io/github/issues-closed-raw/foxifyjs/foxify.svg" alt="closed issues">
	</a>
	<a href="https://snyk.io/test/github/foxifyjs/foxify?targetFile=package.json" target="_blank">
		<img src="https://snyk.io/test/github/foxifyjs/foxify/badge.svg?targetFile=package.json" alt="known vulnerabilities" data-canonical-src="https://snyk.io/test/github/foxifyjs/foxify?targetFile=package.json" style="max-width:100%;">
	</a>
	<a href="https://david-dm.org/foxifyjs/foxify" target="_blank">
		<img src="https://david-dm.org/foxifyjs/foxify.svg" alt="dependencies status">
	</a>
	<a href="https://github.com/foxifyjs/foxify/pulls" target="_blank">
		<img src="https://img.shields.io/badge/PRs-Welcome-brightgreen.svg" alt="pull requests">
	</a>
	<a href="https://github.com/foxifyjs/foxify/blob/master/LICENSE" target="_blank">
		<img src="https://img.shields.io/github/license/foxifyjs/foxify.svg" alt="license">
	</a>
	<a href="https://github.com/foxifyjs/foxify" target="_blank">
		<img src="https://img.shields.io/github/stars/foxifyjs/foxify.svg?style=social&label=Stars" alt="github stars">
	</a>
	<a href="https://github.com/foxifyjs/foxify" target="_blank">
		<img src="https://img.shields.io/github/forks/foxifyjs/foxify.svg?style=social&label=Fork" alt="github stars">
	</a>
	<br>
</div>

- - -

> NOTE: before the first major version there might be so many major changes; so be warned!


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
		throw new HttpExeption('Not Found', 404);
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
| `http.Server` | **9.9.0** | **63,704** |
| - | - | - |
| fastify | 1.2.0 | 59,435 |
| **Foxify** | **0.6.0** | **49,211** |
| restify | 6.4.0 | 43,198 |
| hapi | 17.2.3 | 33,367 |
| express | 4.16.3 | 33,251 |


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

<a href="https://www.buymeacoffee.com/ardalanamini" target="_blank">
	<img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy Me A Coffee" style="height: 41px !important;width: 174px !important;box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;-webkit-box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;">
</a>
