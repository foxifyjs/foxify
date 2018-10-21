import * as http from "http";
import { isIP } from "net";
import { Url } from "url";
import * as accepts from "accepts";
import * as parseRange from "range-parser";
import * as typeIs from "type-is";
import * as parseUrl from "parseurl";
// import proxyAddr = require("proxy-addr");
import * as Response from "./Response";
import * as utils from "./utils";

namespace Request {
  /**
   * @hidden
   */
  export interface Settings {
    subdomain: {
      offset?: number,
    };
  }
}

interface Request {
  /**
   *
   * @alias get
   */
  head(name: string): string | string[] | undefined;
}

class Request extends http.IncomingMessage {
  /**
   * @hidden
   */
  settings!: Request.Settings;

  /**
   * @hidden
   */
  res!: Response;

  query!: any;

  params: { [key: string]: any } = {};

  /**
   * Parse the "Host" header field to a hostname.
   *
   * When the "trust proxy" setting trusts the socket
   * address, the "X-Forwarded-Host" header field will
   * be trusted.
   */
  get hostname() {
    let host = <string>this.get("X-Forwarded-Host");

    if (!host) host = <string>this.get("Host");

    if (!host) return;

    // IPv6 literal support
    const offset = host[0] === "[" ? host.indexOf("]") + 1 : 0;

    const index = host.indexOf(":", offset);

    return index !== -1 ? host.substring(0, index) : host;
  }

  /**
   * Short-hand for `url.parseUrl(req.url).pathname`.
   */
  get path() {
    return (parseUrl(this) as Url).pathname as string;
  }

  /**
   * Return subdomains as an array.
   *
   * Subdomains are the dot-separated parts of the host before the main domain of
   * the app. By default, the domain of the app is assumed to be the last two
   * parts of the host. This can be changed by setting "subdomain offset".
   *
   * For example, if the domain is "tobi.ferrets.example.com":
   * If "subdomain.offset" is not set, req.subdomains is `["ferrets", "tobi"]`.
   * If "subdomain.offset" is 3, req.subdomains is `["tobi"]`.
   */
  get subdomains() {
    const hostname = this.hostname;

    if (!hostname) return [];

    return (!isIP(hostname) ? hostname.split(".").reverse() : [hostname])
      .slice(this.settings.subdomain.offset);
  }

  /**
   * Check if the request was an `_XMLHttpRequest_`.
   */
  get xhr() {
    const val = <string>this.get("X-Requested-With") || "";

    return val.toLowerCase() === "xmlhttprequest";
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
   * @example
   * // Accept: text/html
   * req.accepts("html");
   * // => "html"
   * @example
   * // Accept: text/*, application/json
   * req.accepts("html");
   * // => "html"
   * req.accepts("text/html");
   * // => "text/html"
   * req.accepts("json, text");
   * // => "json"
   * req.accepts("application/json");
   * // => "application/json"
   * @example
   * // Accept: text/*, application/json
   * req.accepts("image/png");
   * req.accepts("png");
   * // => undefined
   * @example
   * // Accept: text/*;q=.5, application/json
   * req.accepts(["html", "json"]);
   * req.accepts("html", "json");
   * req.accepts("html, json");
   * // => "json"
   */
  accepts(...types: string[]): string | string[] | false {
    const accept = accepts(this);

    return accept.types.apply(accept, types);
  }

  /**
   * Check if the given `charset`s are acceptable,
   * otherwise you should respond with 406 "Not Acceptable".
   */
  acceptsCharsets(...charsets: string[]): string | string[] | false {
    const accept = accepts(this);

    return accept.charsets.apply(accept, charsets);
  }

  /**
   * Check if the given `encoding`s are accepted.
   */
  acceptsEncodings(...encodings: string[]): string | string[] | false {
    const accept = accepts(this);

    return accept.encodings.apply(accept, encodings);
  }

  /**
   * Check if the given `lang`s are acceptable,
   * otherwise you should respond with 406 "Not Acceptable".
   */
  acceptsLanguages(...langs: string[]): string | string[] | false {
    const accept = accepts(this);

    return accept.languages.apply(accept, langs);
  }

  /**
   * Return request header.
   *
   * The `Referrer` header field is special-cased,
   * both `Referrer` and `Referer` are interchangeable.
   *
   * @example
   * req.get("Content-Type"); // => "text/plain"
   * @example
   * req.get("content-type"); // => "text/plain"
   * @example
   * req.get("Something"); // => undefined
   */
  get(name: string) {
    if (!name) throw new TypeError("name argument is required to req.get/req.head");

    if (!utils.string.isString(name)) throw new TypeError("name must be a string to req.get/req.head");

    const header = name.toLowerCase();

    switch (header) {
      case "referer":
      case "referrer":
        return this.headers.referrer || this.headers.referer;
      default:
        return this.headers[header];
    }
  }

  /**
   * Check if the incoming request contains the "Content-Type"
   * header field, and it contains the give mime `type`.
   *
   * @example
   * // With Content-Type: text/html; charset=utf-8
   * req.is("html");
   * req.is("text/html");
   * req.is("text/*");
   * // => true
   * @example
   * // When Content-Type is application/json
   * req.is("json");
   * req.is("application/json");
   * req.is("application/*");
   * // => true
   * @example
   * req.is("html");
   * // => false
   */
  is(types?: string | string[]): string | false | null {
    // support flattened arguments
    if (!Array.isArray(types)) {
      const arr = new Array(arguments.length);

      for (let i = 0; i < arr.length; i++) arr[i] = arguments[i];

      return typeIs(this, arr);
    }

    return typeIs(this, types);
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
   */
  range(size: number, options?: parseRange.Options) {
    let range = this.get("Range");

    if (!range) return;

    if (Array.isArray(range)) range = range.join(",");

    return parseRange(size, range, options);
  }
}

/**
 *
 * @alias get
 */
Request.prototype.head = Request.prototype.get;

export = Request;

// /**
//  * Return the remote address from the trusted proxy.
//  *
//  * The is the remote address on the socket unless
//  * "trust proxy" is set.
//  *
//  * @return {String}
//  * @public
//  */
// utils.define(req.prototype, "get", "ip", function (this: http.IncomingMessage) {
//   const trust = (this as any).app.get("trust proxy fn");

//   return proxyAddr(this, trust);
// });

// /**
//  * When "trust proxy" is set, trusted proxy addresses + client.
//  *
//  * For example if the value were "client, proxy1, proxy2"
//  * you would receive the array `["client", "proxy1", "proxy2"]`
//  * where "proxy2" is the furthest down-stream and "proxy1" and
//  * "proxy2" were trusted.
//  *
//  * @return {Array}
//  * @public
//  */
// utils.define(req.prototype, "get", "ips", function (this: http.IncomingMessage) {
//   // let trust = this.app.get("trust proxy fn")
//   // let addrs = proxyAddr.all(this, trust)
//   const addrs = proxyAddr.all(this);

//   // reverse the order (to farthest -> closest)
//   // and remove socket address
//   return utils.array.initial(addrs.reverse());
// });
