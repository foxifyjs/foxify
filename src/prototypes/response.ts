import * as http from 'http'

declare module "http" {
  export interface ServerResponse {
    [key: string]: any

    status(code: number): this
    links(links: { [key: string]: string }): this
    send(body: string | number | boolean | object | Buffer): this
    json(response: object | Array<any>, status?: number): this
    redirect(url: string, code: number): void
    get(field: string): string | number | Array<string> | undefined
  }
}

let res: http.ServerResponse = Object.create(http.ServerResponse.prototype)

let charsetRegExp = /;\s*charset\s*=/

/**
 *
 * @param {Number} code
 * @return {res}
 */
res.status = function(code) {
  this.statusCode = code

  return this
}

/**
 * Set Link header field with the given `links`.
 *
 * Examples:
 *
 *    res.links({
 *      next: 'http://api.example.com/users?page=2',
 *      last: 'http://api.example.com/users?page=5'
 *    });
 *
 * @param {Object} links
 * @return {ServerResponse}
 * @public
 */
res.links = function(links) {
  let link = `${this.get('Link') || ''}, `;

  return this.set(
    'Link',
    link + Object.keys(links)
      .map((rel) => `<${links[rel]}>; rel="${rel}"`)
      .join(', ')
  )
}

/**
 * Send a response.
 *
 * Examples:
 *
 *     res.send(Buffer.from('wahoo'));
 *     res.send({ some: 'json' });
 *     res.send('<p>some html</p>');
 *
 * @param {string|number|boolean|object|Buffer} body
 * @public
 */
// res.send = function(body) {
//   let chunk = body
//   let encoding
//   let req = this.req
//   let type
//
//   // settings
//   let app = this.app
//
//   switch (typeof chunk) {
//     // string defaulting to html
//     case 'string':
//       if (!this.get('Content-Type')) {
//         this.type('html');
//       }
//       break;
//     case 'boolean':
//     case 'number':
//     case 'object':
//       if (chunk === null) {
//         chunk = '';
//       } else if (Buffer.isBuffer(chunk)) {
//         if (!this.get('Content-Type')) {
//           this.type('bin');
//         }
//       } else {
//         return this.json(chunk);
//       }
//       break;
//   }
//
//   // write strings in utf-8
//   if (typeof chunk === 'string') {
//     encoding = 'utf8';
//     type = this.get('Content-Type');
//
//     // reflect this in content-type
//     if (typeof type === 'string') {
//       this.set('Content-Type', setCharset(type, 'utf-8'));
//     }
//   }
//
//   // determine if ETag should be generated
//   let etagFn = app.get('etag fn');
//   let generateETag = !this.get('ETag') && typeof etagFn === 'function';
//
//   // populate Content-Length
//   let len;
//   if (chunk !== undefined) {
//     if (Buffer.isBuffer(chunk)) {
//       // get length of Buffer
//       len = chunk.length;
//     } else if (!generateETag && chunk.length < 1000) {
//       // just calculate length when no ETag + small chunk
//       len = Buffer.byteLength(chunk, encoding);
//     } else {
//       // convert chunk to Buffer and calculate
//       chunk = Buffer.from(chunk, encoding);
//       encoding = undefined;
//       len = chunk.length;
//     }
//
//     this.set('Content-Length', len);
//   }
//
//   // populate ETag
//   let etag;
//   if (generateETag && len !== undefined) {
//     if ((etag = etagFn(chunk, encoding))) {
//       this.set('ETag', etag);
//     }
//   }
//
//   // freshness
//   if (req.fresh) this.statusCode = 304;
//
//   // strip irrelevant headers
//   if (204 === this.statusCode || 304 === this.statusCode) {
//     this.removeHeader('Content-Type');
//     this.removeHeader('Content-Length');
//     this.removeHeader('Transfer-Encoding');
//     chunk = '';
//   }
//
//   if (req.method === 'HEAD') {
//     // skip body for HEAD
//     this.end();
//   } else {
//     // respond
//     this.end(chunk, encoding);
//   }
//
//   return this;
// };

/**
 *
 * @param {Object|Array} response
 * @param {Number} [status=200]
 * @return {res}
 */
res.json = function(response, status = 200) {
  this.writeHead(status, { 'Content-Type': 'application/json' })

  this.end(JSON.stringify(response))

  return this
};

/**
 *
 * @param {String} url
 * @param {Number} code
 * @return {res}
 */
res.redirect = function(url, code = 302) {
  this.writeHead(code, { 'Location': url })

  return this.end()
};

res.get = function(field) {
  return this.getHeader(field)
}

// res.set = res.header = function(field, val) {
//   if (arguments.length === 2) {
//     let value = Array.isArray(val)
//       ? val.map(String)
//       : String(val);
//
//     // add charset to content-type
//     if (field.toLowerCase() === 'content-type') {
//       if (Array.isArray(value)) {
//         throw new TypeError('Content-Type cannot be set to an Array');
//       }
//       if (!charsetRegExp.test(value)) {
//         let charset = mime.charsets.lookup(value.split(';')[0]);
//         if (charset) value += '; charset=' + charset.toLowerCase();
//       }
//     }
//
//     this.setHeader(field, value);
//   } else {
//     for (let key in field) {
//       this.set(key, field[key]);
//     }
//   }
//   return this;
// };

export = res
