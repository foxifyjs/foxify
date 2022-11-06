# @foxify/inject

Injects a fake HTTP request/response into a node HTTP server for simulating server logic, writing tests, or debugging.
Does not use a socket connection so can be run against an inactive server (server not in listen mode).

[![NPM Version](https://img.shields.io/npm/v/@foxify/inject.svg)](https://www.npmjs.com/package/@foxify/inject)
[![Node Version](https://img.shields.io/node/v/@foxify/inject.svg)](https://nodejs.org)
[![TypeScript Version](https://img.shields.io/npm/types/@foxify/inject.svg)](https://www.typescriptlang.org)
[![Tested With Jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://github.com/facebook/jest)
[![Pull Requests](https://img.shields.io/badge/PRs-Welcome-brightgreen.svg)](https://github.com/foxifyjs/foxify/pulls)
[![License](https://img.shields.io/github/license/foxifyjs/inject.svg)](https://github.com/foxifyjs/foxify/blob/main/packages/inject/LICENSE)
[![Package Quality](http://npm.packagequality.com/shield/%40foxify%2Finject.svg)](http://packagequality.com/#?package=@foxify/inject)
[![NPM Total Downloads](https://img.shields.io/npm/dt/@foxify/inject.svg)](https://www.npmjs.com/package/@foxify/inject)
[![NPM Monthly Downloads](https://img.shields.io/npm/dm/@foxify/inject.svg)](https://www.npmjs.com/package/@foxify/inject)
[![known vulnerabilities](https://snyk.io/test/github/foxifyjs/foxify/badge.svg?targetFile=packages/inject/package.json)](https://snyk.io/test/github/foxifyjs/foxify?targetFile=packages/inject/package.json)

## Example

```javascript
const http = require('http')
const inject = require('@foxify/inject').default

const dispatch = function (req, res) {
  const reply = 'Hello World'
  res.writeHead(200, { 'Content-Type': 'text/plain', 'Content-Length': reply.length })
  res.end(reply)
}

// Nah, you don't need this anymore :)
// const server = http.createServer(dispatch)

inject(dispatch, { method: 'get', url: '/' }, (err, res) => {
  console.log(res.body)
})
```
