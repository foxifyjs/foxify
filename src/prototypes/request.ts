import { IncomingMessage } from 'http'
import { isIP } from 'net'
import * as accepts from 'accepts'
import * as parseRange from 'range-parser'
import * as typeis from 'type-is'
import * as proxyaddr from 'proxy-addr'
import * as parse from 'parseurl'
import * as fresh from 'fresh'
import { defineGetter } from '../utils'

/**
 * @namespace {IncomingMessage}
 */

declare module "http" {
  export interface IncomingMessage {
    [key: string]: any

    get(name: string): string | Array<string> | undefined
    head(name: string): string | Array<string> | undefined
    accepts(type: Array<string> | ArrayLike<string> | string): string | Array<string> | false
    acceptsEncodings(encoding?: Array<string> | ArrayLike<string> | string): string | Array<string>
    acceptsCharsets(charset?: Array<string> | ArrayLike<string> | string): string | Array<string>
    acceptsLanguages(lang?: Array<string> | ArrayLike<string> | string): string | Array<string>
    range(size: number, options?: parseRange.Options): parseRange.Result | parseRange.Ranges | undefined
    is(types?: string | Array<string>): string | false | null
  }
}

let req: IncomingMessage = Object.create(IncomingMessage.prototype)

/**
 * Return request header.
 *
 * The `Referrer` header field is special-cased,
 * both `Referrer` and `Referer` are interchangeable.
 *
 * @param {String} name
 * @return {String}
 * @example
 *
 *     req.get('Content-Type');
 *     // => "text/plain"
 *
 *     req.get('content-type');
 *     // => "text/plain"
 *
 *     req.get('Something');
 *     // => undefined
 *
 * // Aliased as `req.header()`.
 */
req.get = req.head = function(name) {
  if (!name) throw new TypeError('name argument is required to req.get/req.head')

  if (!String.isInstance(name)) throw new TypeError('name must be a string to req.get/req.head')

  let header = name.toLowerCase()

  switch (header) {
    case 'referer':
    case 'referrer':
      return this.headers.referrer || this.headers.referer
    default:
      return this.headers[header]
  }
}

/**
 * TODO: update docs.
 *
 * Check if the given `type(s)` is acceptable, returning
 * the best match when true, otherwise `undefined`, in which
 * case you should respond with 406 "Not Acceptable".
 *
 * The `type` value may be a single MIME type string
 * such as "application/json", an extension name
 * such as "json", a comma-delimited list such as "json, html, text/plain",
 * an argument list such as `"json", "html", "text/plain"`,
 * or an array `["json", "html", "text/plain"]`. When a list
 * or array is given, the _best_ match, if any is returned.
 *
 * @param {String|Array} type[s]
 * @return {String|Array|Boolean}
 * @example
 *
 *     // Accept: text/html
 *     req.accepts('html');
 *     // => "html"
 *
 *     // Accept: text/*, application/json
 *     req.accepts('html');
 *     // => "html"
 *     req.accepts('text/html');
 *     // => "text/html"
 *     req.accepts('json, text');
 *     // => "json"
 *     req.accepts('application/json');
 *     // => "application/json"
 *
 *     // Accept: text/*, application/json
 *     req.accepts('image/png');
 *     req.accepts('png');
 *     // => undefined
 *
 *     // Accept: text/*;q=.5, application/json
 *     req.accepts(['html', 'json']);
 *     req.accepts('html', 'json');
 *     req.accepts('html, json');
 *     // => "json"
 */
req.accepts = function() {
  let accept = accepts(this)

  return accept.types.apply(accept, arguments)
}

/**
 * Check if the given `encoding`s are accepted.
 *
 * @param {String} ...encoding
 * @return {String|Array}
 */
req.acceptsEncodings = function() {
  let accept = accepts(this)

  return accept.encodings.apply(accept, arguments)
}

/**
 * Check if the given `charset`s are acceptable,
 * otherwise you should respond with 406 "Not Acceptable".
 *
 * @param {String} ...charset
 * @return {String|Array}
 */
req.acceptsCharsets = function() {
  let accept = accepts(this)

  return accept.charsets.apply(accept, arguments)
}

/**
 * Check if the given `lang`s are acceptable,
 * otherwise you should respond with 406 "Not Acceptable".
 *
 * @param {String} ...lang
 * @return {String|Array}
 */
req.acceptsLanguages = function() {
  let accept = accepts(this)

  return accept.languages.apply(accept, arguments)
}

/**
 * Parse Range header field, capping to the given `size`.
 *
 * Unspecified ranges such as "0-" require knowledge of your resource length. In
 * the case of a byte range this is of course the total number of bytes. If the
 * Range header field is not given `undefined` is returned, `-1` when unsatisfiable,
 * and `-2` when syntactically invalid.
 *
 * When ranges are returned, the array has a "type" property which is the type of
 * range that is required (most commonly, "bytes"). Each array element is an object
 * with a "start" and "end" property for the portion of the range.
 *
 * NOTE: remember that ranges are inclusive, so for example "Range: users=0-3"
 * should respond with 4 users when available, not 3.
 *
 * @param {Number} size
 * @param {Object} [options]
 * @return {Number|Array}
 */
req.range = function(size, options) {
  let range = this.get('Range')

  if (!range) return

  if (range instanceof Array) range = range.join(',')

  return parseRange(size, range, options)
}

/**
 * Check if the incoming request contains the "Content-Type"
 * header field, and it contains the give mime `type`.
 *
 * Examples:
 *
 *      // With Content-Type: text/html; charset=utf-8
 *      req.is('html');
 *      req.is('text/html');
 *      req.is('text/*');
 *      // => true
 *
 *      // When Content-Type is application/json
 *      req.is('json');
 *      req.is('application/json');
 *      req.is('application/*');
 *      // => true
 *
 *      req.is('html');
 *      // => false
 *
 * @param {String|Array} types...
 * @return {String|false|null}
 * @public
 */
req.is = function(types) {

  // support flattened arguments
  if (!Array.isArray(types)) {
    let arr = new Array(arguments.length)

    for (let i = 0; i < arr.length; i++) arr[i] = arguments[i]

    return typeis(this, arr)
  }

  return typeis(this, types)
}

/**
 * Return the remote address from the trusted proxy.
 *
 * The is the remote address on the socket unless
 * "trust proxy" is set.
 *
 * @return {String}
 * @public
 */
// defineGetter(req, 'ip', function(this: IncomingMessage) {
//   let trust = this.app.get('trust proxy fn')
//
//   return proxyaddr(this, trust)
// })

/**
 * When "trust proxy" is set, trusted proxy addresses + client.
 *
 * For example if the value were "client, proxy1, proxy2"
 * you would receive the array `["client", "proxy1", "proxy2"]`
 * where "proxy2" is the furthest down-stream and "proxy1" and
 * "proxy2" were trusted.
 *
 * @return {Array}
 * @public
 */
// defineGetter(req, 'ips', function(this: IncomingMessage) {
//   let trust = this.app.get('trust proxy fn')
//   let addrs = proxyaddr.all(this, trust)
//
//   // reverse the order (to farthest -> closest)
//   // and remove socket address
//   return addrs.reverse().initial()
// })

/**
 * Return subdomains as an array.
 *
 * Subdomains are the dot-separated parts of the host before the main domain of
 * the app. By default, the domain of the app is assumed to be the last two
 * parts of the host. This can be changed by setting "subdomain offset".
 *
 * For example, if the domain is "tobi.ferrets.example.com":
 * If "subdomain offset" is not set, req.subdomains is `["ferrets", "tobi"]`.
 * If "subdomain offset" is 3, req.subdomains is `["tobi"]`.
 *
 * @return {Array}
 * @public
 */
// defineGetter(req, 'subdomains', function(this: IncomingMessage) {
//   let hostname = this.hostname
//
//   if (!hostname) return []
//
//   let offset = this.app.get('subdomain offset')
//   let subdomains = !isIP(hostname) ? hostname.split('.').reverse() : [hostname]
//
//   return subdomains.slice(offset)
// })

/**
 * Short-hand for `url.parse(req.url).pathname`.
 *
 * @return {String}
 * @public
 */
defineGetter(req, 'path', function(this: IncomingMessage) {
  let url = parse(this)

  return url ? url.pathname : ''
})

/**
 * Parse the "Host" header field to a hostname.
 *
 * When the "trust proxy" setting trusts the socket
 * address, the "X-Forwarded-Host" header field will
 * be trusted.
 *
 * @return {String}
 * @public
 */
// defineGetter(req, 'hostname', function(this: IncomingMessage) {
//   let trust = this.app.get('trust proxy fn')
//   let host = <string>this.get('X-Forwarded-Host')
//
//   if (!host || !trust(this.connection.remoteAddress, 0)) host = <string>this.get('Host')
//
//   if (!host) return;
//
//   // IPv6 literal support
//   var offset = host[0] === '[' ? host.indexOf(']') + 1 : 0
//
//   var index = host.indexOf(':', offset)
//
//   return index !== -1 ? host.substring(0, index) : host
// })

/**
 * Check if the request is fresh, aka
 * Last-Modified and/or the ETag
 * still match.
 *
 * @return {Boolean}
 * @public
 */
defineGetter(req, 'fresh', function(this: IncomingMessage) {
  let method = this.method
  let res = this.res
  let status = res.statusCode

  // GET or HEAD for weak freshness validation only
  if ('GET' !== method && 'HEAD' !== method) return false

  // 2xx or 304 as per rfc2616 14.26
  if ((status >= 200 && status < 300) || 304 === status) {
    return fresh(this.headers, {
      'etag': res.get('ETag'),
      'last-modified': res.get('Last-Modified')
    })
  }

  return false
})

/**
 * Check if the request is stale, aka
 * "Last-Modified" and / or the "ETag" for the
 * resource has changed.
 *
 * @return {Boolean}
 * @public
 */
defineGetter(req, 'stale', function(this: IncomingMessage) {
  return !this.fresh
})

/**
 * Check if the request was an _XMLHttpRequest_.
 *
 * @return {Boolean}
 * @public
 */
defineGetter(req, 'xhr', function(this: IncomingMessage) {
  let val = <string>this.get('X-Requested-With') || ''

  return val.toLowerCase() === 'xmlhttprequest'
})

export = req
