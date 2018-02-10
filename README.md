<div align="center">
	<a href="https://github.com/foxifyjs/foxify">
		<img src="http://res.cloudinary.com/dmny54mk6/image/upload/v1518111172/3ZIcg4.jpg" alt="Foxify Logo" style="max-width: 400px;">
	</a>
	<h1>Foxify</h1>
	<p>The <b>fast</b>, <b>easy to use</b> &amp; <b>typescript ready</b> framework for <a href="https://nodejs.org" target="_blank">Node.js</a></p>
	<p>Inspired by <a href="https://expressjs.com" target="__blank">Express</a></p>
	<a href="https://www.npmjs.com/package/foxify" target="_blank">
		<img src="https://img.shields.io/npm/v/foxify.svg" alt="npm version">
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
	<a href="https://github.com/foxifyjs/foxify/blob/master/LICENSE" target="_blank">
		<img src="https://img.shields.io/github/license/foxifyjs/foxify.svg" alt="license">
	</a>
	<a href="https://github.com/foxifyjs/foxify" target="_blank">
		<img src="https://img.shields.io/github/stars/foxifyjs/foxify.svg?style=social&label=Stars" alt="github stars">
	</a>
	<br>
</div>

- - -

> NOTE: before the first major version there might be so many major changes; so be warned!


## Installation

Before installing, [download and install Node.js](https://nodejs.org/en/download/).
Node.js 6.4.0 or higher is required.

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

More detailed [sample](https://github.com/foxifyjs/foxify/tree/master/sample) is available.


## Features
- Written in ES6
- Robust routing (faster than `Express`)
- `Express` middleware support
- Robust database modeling (at the moment it's basically `mongodb` package but implemented the fast way)
- Simple and powerful error handling
- Focus on high performance
- HTTP helpers (redirection, etc)
- View system supporting lots of template engines
- Content negotiation
- Executable for generating applications quickly


## Benchmarks

**Machine**: Intel Core i7 (4 cores, 8 threads), 8GiB RAM

**Method**: `autocannon -c 100 -d 40 -p 10 localhost:3000` * 2, taking the second average

| Framework | Version | Request/Second |
|:---------:|:-------:|:---:|
| `http.Server` | 9.5.0 | 23,735 |
| - | - | - |
| **Foxify** | 0.2.0 | 15,661 |
| Restify | 6.3.4 | 15,067 |
| Hapi | 17.2.0 | 13,657 |
| Express | 4.16.2 | 10,913 |
