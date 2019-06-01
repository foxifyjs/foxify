import * as assert from "assert";
import * as contentDisposition from "content-disposition";
import * as contentType from "content-type";
import * as cookie from "cookie";
import { sign } from "cookie-signature";
import * as escapeHtml from "escape-html";
import * as http from "http";
import * as onFinished from "on-finished";
import * as path from "path";
import send = require("send");
import { http as httpStatus } from "./constants";
import Request from "./Request";
import {
  encodeUrl,
  fresh,
  function as func,
  object,
  string,
  vary,
} from "./utils";
import { Engine } from "./view";

const resolve = path.resolve;
const STATUS_CODES = http.STATUS_CODES;

const charsetRegExp = /;\s*charset\s*=/;

/**
 * Set the charset in a given Content-Type string.
 *
 * @param {String} type
 * @param {String} charset
 * @return {String}
 * @api private
 */
const setCharset = (type?: string, charset?: string) => {
  if (!type || !charset) return type;

  // parse type
  const parsed = contentType.parse(type);

  // set charset
  parsed.parameters.charset = charset;

  // format type
  return contentType.format(parsed);
};

/**
 * Stringify JSON, like JSON.stringify, but v8 optimized, with the
 * ability to escape characters that can trigger HTML sniffing.
 *
 * @param {*} value
 * @param {function} replaces
 * @param {number} spaces
 * @param {boolean} escape
 * @returns {string}
 * @private
 */
const stringify = (
  value: any,
  replacer?: (key: string, value: any) => any,
  spaces?: number,
  escape?: boolean,
) => {
  // v8 checks arguments.length for optimizing simple call
  // https://bugs.chromium.org/p/v8/issues/detail?id=4730

  if (!escape) return JSON.stringify(value, replacer, spaces);

  return JSON.stringify(value, replacer, spaces).replace(/[<>&]/g, c => {
    switch (c.charCodeAt(0)) {
      case 0x3c:
        return "\\u003c";
      case 0x3e:
        return "\\u003e";
      case 0x26:
        return "\\u0026";
      default:
        return c;
    }
  });
};

/**
 * Check if `path` looks absolute.
 *
 * @param {String} path
 * @return {Boolean}
 * @api private
 */
const isAbsolute = (path: string) => {
  if ("/" === path[0]) return true;
  if (":" === path[1] && ("\\" === path[2] || "/" === path[2])) return true; // Windows device path
  if ("\\\\" === path.substring(0, 2)) return true; // Microsoft Azure absolute path
};

/**
 * pipe the send file stream
 */
const sendfile = (
  res: Response,
  file: send.SendStream,
  options: object,
  callback: (...args: any[]) => void,
) => {
  let done = false;
  let streaming: boolean;

  // request aborted
  function onaborted() {
    if (done) return;

    done = true;

    const err = new Error("Request aborted");

    (err as any).code = "ECONNABORTED";

    callback(err);
  }

  // directory
  function ondirectory() {
    if (done) return;

    done = true;

    const err = new Error("EISDIR, read");

    (err as any).code = "EISDIR";

    callback(err);
  }

  // errors
  function onerror(err: Error) {
    if (done) return;

    done = true;

    callback(err);
  }

  // ended
  function onend() {
    if (done) return;

    done = true;

    callback();
  }

  // file
  function onfile() {
    streaming = false;
  }

  // finished
  function onfinish(err: any) {
    if (err && err.code === "ECONNRESET") return onaborted();
    if (err) return onerror(err);
    if (done) return;

    setImmediate(() => {
      if (streaming !== false && !done) {
        onaborted();
        return;
      }

      if (done) return;

      done = true;

      callback();
    });
  }

  // streaming
  function onstream() {
    streaming = true;
  }

  file.on("directory", ondirectory);
  file.on("end", onend);
  file.on("error", onerror);
  file.on("file", onfile);
  file.on("stream", onstream);

  onFinished(res, onfinish);

  if ((options as any).headers) {
    // set headers on successful transfer
    file.on("headers", (res: Response) => {
      const obj = (options as any).headers;
      const keys = Object.keys(obj);

      let k;
      for (let i = 0; i < keys.length; i++) {
        k = keys[i];

        res.setHeader(k, obj[k]);
      }
    });
  }

  // pipe
  file.pipe(res);
};

/**
 * Parse accept params `str` returning an
 * object with `.value`, `.quality` and `.params`.
 * also includes `.originalIndex` for stable sorting
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */
const acceptParams = (str: string, index?: number) => {
  const parts = str.split(/ *; */);

  const ret = {
    originalIndex: index,
    params: {} as { [key: string]: any },
    quality: 1,
    value: parts[0],
  };

  let pms;
  for (let i = 1; i < parts.length; ++i) {
    pms = parts[i].split(/ *= */);

    if ("q" === pms[0]) ret.quality = parseFloat(pms[1]);
    else ret.params[pms[0]] = pms[1];
  }

  return ret;
};

/**
 * Normalize the given `type`, for example "html" becomes "text/html".
 *
 * @param {String} type
 * @return {Object}
 * @api private
 */
const normalizeType = (type: string) => {
  return ~type.indexOf("/")
    ? acceptParams(type)
    : { value: (send.mime as any).lookup(type), params: {} };
};

/**
 * Normalize `types`, for example "html" becomes "text/html".
 *
 * @param {Array} types
 * @return {Array}
 * @api private
 */
const normalizeTypes = (types: string[]) => {
  const ret = [];

  for (let i = 0; i < types.length; ++i) {
    ret.push(normalizeType(types[i]));
  }

  return ret;
};

namespace Response {
  /**
   * @hidden
   */
  export interface Settings {
    engine?: Engine;
    etag?: (
      body: string | Buffer,
      encoding?: BufferEncoding,
    ) => string | undefined;
    json: {
      escape: boolean;
      spaces?: number;
      replacer?: (...args: any[]) => any;
    };
    jsonp: {
      callback: string;
    };
  }
}

interface Response {
  /**
   *
   * @alias contentType
   */
  type(type: string): this;

  /**
   *
   * @alias header
   */
  set(field: string | object, val?: string | string[]): this;

  /**
   * Get value for header `field`.
   *
   * @alias getHeader
   */
  get(name: string): number | string | string[] | undefined;
}

class Response extends http.ServerResponse {
  /**
   * @hidden
   */
  public settings!: Response.Settings;

  /**
   * @hidden
   */
  public stringify!: { [statusCode: number]: any };

  /**
   * @hidden
   */
  public next!: () => void;

  /**
   * @hidden
   */
  public req: Request;

  /**
   * Check if the request is fresh, aka
   * Last-Modified and/or the ETag
   * still match.
   */
  public get fresh() {
    const req = this.req;
    const method = req.method;

    // GET or HEAD for weak freshness validation only
    if ("GET" !== method && "HEAD" !== method) return false;

    const status = this.statusCode;

    // 2xx or 304 as per rfc2616 14.26
    if (
      (status >= HTTP.OK && status < HTTP.MULTIPLE_CHOICES) ||
      HTTP.NOT_MODIFIED === status
    ) {
      return fresh(req.headers, this.get("last-modified") as string);
    }

    return false;
  }

  /**
   * Check if the request is stale, aka
   * "Last-Modified" and / or the "ETag" for the
   * resource has changed.
   */
  public get stale() {
    return !this.fresh;
  }

  /**
   *
   * @param req request
   */
  constructor(req: Request) {
    super(req);

    this.req = req;

    this.type = this.contentType;
    this.set = this.header;
    this.get = this.getHeader;
  }

  /**
   * Set response status code.
   *
   * @example
   * res.status(500);
   */
  public status(code: httpStatus) {
    this.statusCode = code;

    return this;
  }

  /**
   * Set Link header field with the given links.
   *
   * @example
   * res.links({
   *   next: "http://api.example.com/users?page=2",
   *   last: "http://api.example.com/users?page=5"
   * });
   */
  public links(links: { [rel: string]: string }) {
    let link = this.get("link") || "";

    if (link) link += ", ";

    return this.set(
      "link",
      `${link}${Object.keys(links)
        .map(rel => `<${links[rel]}>; rel="${rel}"`)
        .join(", ")}`,
    );
  }

  /**
   * Send a response.
   *
   * @example
   * res.send(Buffer.from("wahoo"));
   * @example
   * res.send({ some: "json" });
   * @example
   * res.send("<p>some html</p>");
   */
  public send(body: string | object | any[] | Buffer): this {
    let encoding: BufferEncoding | undefined;

    if (string.isString(body)) {
      encoding = "utf-8";
      // reflect this in content-type
      if (!this.get("content-type")) {
        this.set("Content-Type", setCharset("text/html", encoding));
      }
    } else if (Buffer.isBuffer(body)) {
      if (!this.get("content-type")) this.type("bin");
    } else return this.json(body);

    const etagFn = this.settings.etag;

    if (!this.get("ETag") && etagFn) {
      const etag = etagFn(body, encoding);

      if (etag) this.set("ETag", etag);
    }

    // freshness
    if (this.fresh) this.statusCode = HTTP.NOT_MODIFIED;

    const statusCode = this.statusCode;

    // strip irrelevant headers
    if (HTTP.NO_CONTENT === statusCode || HTTP.NOT_MODIFIED === statusCode) {
      this.removeHeader("content-type");
      this.removeHeader("content-length");
      this.removeHeader("transfer-encoding");

      body = "";
    }

    // skip body for HEAD
    if (this.req.method === "HEAD") this.end();
    else this.end(body, encoding as string);

    return this;
  }

  /**
   * Send JSON response.
   *
   * @example
   * res.json({ user: "tj" });
   */
  public json(obj: object | any[]) {
    if (!this.get("Content-Type")) {
      this.set("Content-Type", "application/json");
    }

    const { replacer, spaces, escape } = this.settings.json;

    return this.send(
      (this.stringify[this.statusCode] || stringify)(
        obj,
        replacer,
        spaces,
        escape,
      ),
    );
  }

  /**
   * Send JSON response with JSONP callback support.
   *
   * @example
   * res.jsonp({ user: "tj" });
   */
  public jsonp(obj: object) {
    // settings
    const { escape, replacer, spaces } = this.settings.json;
    let body = stringify(obj, replacer, spaces, escape);
    let callback = this.req.query[this.settings.jsonp.callback];

    // content-type
    if (!this.get("content-type")) {
      this.set("x-content-type-options", "nosniff");
      this.set("content-type", "application/json");
    }

    // fixup callback
    if (Array.isArray(callback)) callback = callback[0];

    // jsonp
    if (string.isString(callback) && callback.length !== 0) {
      this.set("x-content-type-options", "nosniff");
      this.set("content-type", "text/javascript");

      // restrict callback charset
      callback = callback.replace(/[^\[\]\w$.]/g, "");

      // replace chars not allowed in JavaScript that are in JSON
      body = body.replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");

      // the /**/ is a specific security mitigation for "Rosetta Flash JSONP abuse"
      // the typeof check is just to reduce client error noise
      body = `/**/ typeof ${callback}  === 'function' && ${callback}(${body});`;
    }

    return this.send(body);
  }

  /**
   * Send given HTTP status code.
   *
   * Sets the response status to `statusCode` and the body of the
   * response to the standard description from node's http.STATUS_CODES
   * or the statusCode number if no description.
   *
   * @example
   * res.sendStatus(200);
   */
  public sendStatus(statusCode: httpStatus) {
    this.statusCode = statusCode;

    this.type("txt");

    return this.send(STATUS_CODES[statusCode] || `${statusCode}`);
  }

  /**
   * Transfer the file at the given `path`.
   *
   * Automatically sets the _Content-Type_ response header field.
   * The callback `callback(err)` is invoked when the transfer is complete
   * or when an error occurs. Be sure to check `res.sentHeader`
   * if you wish to attempt responding, as the header and some data
   * may have already been transferred.
   *
   * Options:
   *   - `maxAge`   defaulting to 0 (can be string converted by `ms`)
   *   - `root`     root directory for relative filenames
   *   - `headers`  object of headers to serve with file
   *   - `dotfiles` serve dotfiles, defaulting to false; can be `"allow"` to send them
   *
   * Other options are passed along to `send`.
   *
   * @example
   * // The following example illustrates how `res.sendFile()` may
   * // be used as an alternative for the `static()` middleware for
   * // dynamic situations. The code backing `res.sendFile()` is actually
   * // the same code, so HTTP cache support etc is identical.
   *
   * app.get("/user/:uid/photos/:file", function(req, res) {
   *   let uid = req.params.uid;
   *   let file = req.params.file;
   *
   *   req.user.mayViewFilesFrom(uid, function(yes) {
   *     if (yes) {
   *       res.sendFile("/uploads/" + uid + "/" + file);
   *     } else {
   *       res.send(403, "Sorry! you cant see that.");
   *     }
   *   });
   * });
   */
  public sendFile(path: string, callback?: (...args: any[]) => void): void;
  public sendFile(
    path: string,
    options: object,
    callback?: (...args: any[]) => void,
  ): void;
  public sendFile(
    path: string,
    options: object | ((...args: any[]) => void) = {},
    callback?: (...args: any[]) => void,
  ) {
    if (func.isFunction(options)) {
      callback = options;
      options = {};
    }

    assert(path, "Argument 'path' is required to res.sendFile");

    // support function as second arg

    assert(
      (options as any).root && isAbsolute(path),
      "Path must be absolute or specify root to res.sendFile",
    );

    // create file stream
    const pathname = encodeURI(path);
    const file = send(this.req, pathname, options);

    // transfer
    sendfile(this, file, options, (err: any) => {
      if (callback) return callback(err);
      if (err && err.code === "EISDIR") return this.next();

      // next() all but write errors
      if (err && err.code !== "ECONNABORTED" && err.syscall !== "write") {
        throw err;
      }
    });
  }

  /**
   * Transfer the file at the given `path` as an attachment.
   *
   * Optionally providing an alternate attachment `filename`,
   * and optional callback `callback(err)`. The callback is invoked
   * when the data transfer is complete, or when an error has
   * ocurred. Be sure to check `res.headersSent` if you plan to respond.
   *
   * Optionally providing an `options` object to use with `res.sendFile()`.
   * This function will set the `Content-Disposition` header, overriding
   * any `Content-Disposition` header passed as header options in order
   * to set the attachment and filename.
   *
   * This method uses `res.sendFile()`.
   */
  public download(path: string, callback?: (...args: any[]) => void): void;
  public download(
    path: string,
    filename: string,
    callback?: (...args: any[]) => void,
  ): void;
  public download(
    path: string,
    filename: string,
    options: object,
    callback?: (...args: any[]) => void,
  ): void;
  public download(
    path: string,
    filename?: string | ((...args: any[]) => void),
    options: object | ((...args: any[]) => void) = {},
    callback?: (...args: any[]) => void,
  ) {
    if (func.isFunction(filename)) {
      callback = filename;
      filename = undefined;
    } else if (func.isFunction(options)) {
      callback = options;
      options = {};
    }

    // support function as second or third arg

    // set Content-Disposition when file is sent
    const headers = {
      "Content-Disposition": contentDisposition(filename || path),
    };

    // merge user-provided headers
    if ((options as { [key: string]: any }).headers) {
      const keys = Object.keys((options as { [key: string]: any }).headers);

      let key;
      for (let i = 0; i < keys.length; i++) {
        key = keys[i];

        if (key.toLowerCase() !== "content-disposition") {
          (headers as { [key: string]: any })[key] = (options as {
            [key: string]: any;
          }).headers[key];
        }
      }
    }

    // merge user-provided options
    options = Object.assign({}, options, { headers });

    // Resolve the full path for sendFile
    const fullPath = resolve(path);

    // send file
    return this.sendFile(fullPath, options, callback);
  }

  /**
   * Set _Content-Type_ response header with `type` through `mime.lookup()`
   * when it does not contain "/", or set the Content-Type to `type` otherwise.
   *
   * @returns for chaining
   * @example
   * res.type(".html");
   * @example
   * res.type("html");
   * @example
   * res.type("json");
   * @example
   * res.type("application/json");
   * @example
   * res.type("png");
   */
  public contentType(type: string) {
    return this.set(
      "Content-Type",
      type.indexOf("/") === -1 ? (send.mime as any).lookup(type) : type,
    );
  }

  /**
   * Respond to the Acceptable formats using an `obj`
   * of mime-type callbacks.
   *
   * This method uses `req.accepted`, an array of
   * acceptable types ordered by their quality values.
   * When "Accept" is not present the _first_ callback
   * is invoked, otherwise the first match is used. When
   * no match is performed the server responds with
   * 406 "Not Acceptable".
   *
   * By default Foxify passes an `Error`
   * with a `.status` of 406 to `next(err)`
   * if a match is not made. If you provide
   * a `.default` callback it will be invoked
   * instead.
   *
   * Content-Type is set for you, however if you choose
   * you may alter this within the callback using `res.type()`
   * or `res.set("Content-Type", ...)`.
   *
   * @returns for chaining
   * @example
   * res.format({
   *   "text/plain": function() {
   *     res.send("hey");
   *   },
   *   "text/html": function() {
   *     res.send("<p>hey</p>");
   *   },
   *   "appliation/json": function() {
   *     res.send({ message: "hey" });
   *   }
   * });
   * @example
   * // In addition to canonicalized MIME types you may
   * // also use extnames mapped to these types:
   *
   * res.format({
   *   text: function() {
   *     res.send("hey");
   *   },
   *   html: function() {
   *     res.send("<p>hey</p>");
   *   },
   *   json: function() {
   *     res.send({ message: "hey" });
   *   }
   * });
   */
  public format(types: {
    [type: string]: (req: Request, res: Response, next: () => void) => void;
  }) {
    const req = this.req;
    const next = this.next;

    const fn = types.default;

    if (fn) delete types.default;

    const keys = Object.keys(types);

    const key = keys.length > 0 ? (req.accepts(...keys) as string) : false;

    this.vary("Accept");

    if (key) {
      this.set("content-type", normalizeType(key).value);
      types[key](req, this, next);
    } else if (fn) {
      fn(req, this, next);
    } else {
      const err: any = new Error("Not Acceptable");

      err.status = err.statusCode = 406;
      err.types = normalizeTypes(keys).map(o => o.value);

      // next(err);
      throw err;
    }

    return this;
  }

  /**
   * Set _Content-Disposition_ header to _attachment_ with optional `filename`.
   */
  public attachment(filename?: string) {
    if (filename) this.type(path.extname(filename));

    return this.set("Content-Disposition", contentDisposition(filename));
  }

  /**
   * Append additional header `field` with value `val`.
   *
   * @returns for chaining
   * @example
   * res.append("Link", ["<http://localhost/>", "<http://localhost:3000/>"]);
   * @example
   * res.append("Set-Cookie", "foo=bar; Path=/; HttpOnly");
   * @example
   * res.append("Warning", "199 Miscellaneous warning");
   */
  public append(field: string, value: string | string[]) {
    const prev = this.get(field) as string | string[];

    if (prev) {
      // concat the new and prev vals
      value = Array.isArray(prev)
        ? prev.concat(value)
        : Array.isArray(value)
        ? [prev].concat(value)
        : [prev, value];
    }

    return this.set(field, value);
  }

  /**
   * Set header `field` to `val`, or pass
   * an object of header fields.
   *
   * @returns for chaining
   * @example
   * res.set("Foo", ["bar", "baz"]);
   * @example
   * res.set("Accept", "application/json");
   * @example
   * res.set({ Accept: "text/plain", "X-API-Key": "tobi" });
   */
  public header(headers: {
    [header: string]: string | number | string[];
  }): this;
  public header(field: string, value: string | string[]): this;
  public header(field: string | object, value?: string | number | string[]) {
    if (!string.isString(field)) {
      // tslint:disable-next-line:forin
      for (const key in field as object) {
        this.header(
          key,
          (field as {
            [key: string]: any;
          })[key],
        );
      }

      return this;
    }

    value = Array.isArray(value) ? value.map(String) : `${value}`;

    // add charset to content-type
    if ((field as string).toLowerCase() === "content-type") {
      assert(!Array.isArray(value), "Content-Type cannot be set to an Array");

      if (!charsetRegExp.test(value as string)) {
        const charset = (send.mime as any).charsets.lookup(
          (value as string).split(";")[0],
        );

        if (charset) value += `; charset=${charset.toLowerCase()}`;
      }
    }

    this.setHeader(field as string, value);

    return this;
  }

  /**
   * Clear cookie `name`.
   *
   * @returns for chaining
   */
  public clearCookie(name: string, options: object = {}) {
    return this.cookie(
      name,
      "",
      Object.assign({ expires: new Date(1), path: "/" }, options),
    );
  }

  /**
   * Set cookie `name` to `value`, with the given `options`.
   *
   * Options:
   *    - `maxAge`   max-age in milliseconds, converted to `expires`
   *    - `signed`   sign the cookie
   *    - `path`     defaults to "/"
   *
   * @returns for chaining
   * @example
   * // "Remember Me" for 15 minutes
   * res.cookie("rememberme", "1", { expires: new Date(Date.now() + 900000), httpOnly: true });
   * @example
   * // save as above
   * res.cookie("rememberme", "1", { maxAge: 900000, httpOnly: true })
   */
  public cookie(
    name: string,
    value: number | string | object,
    options: {
      maxAge?: number;
      signed?: boolean;
      path?: string;
      [option: string]: any;
    } = {},
  ) {
    options = Object.assign({}, options);

    const secret = (this.req as any).secret;
    const signed = options.signed;

    assert(
      !signed || secret,
      "cookieParser('secret') required for signed cookies",
    );

    value = object.isObject(value) ? `j:${JSON.stringify(value)}` : `${value}`;

    if (signed) value = `s:${sign(value, secret)}`;

    if (options.maxAge !== undefined) {
      (options as any).expires = new Date(Date.now() + options.maxAge);
      options.maxAge /= 1000;
    }

    if (!options.path) options.path = "/";

    return this.append("Set-Cookie", cookie.serialize(name, value, options));
  }

  /**
   * Set the location header to `url`.
   *
   * The given `url` can also be "back", which redirects
   * to the _Referrer_ or _Referer_ headers or "/".
   *
   * @returns for chaining
   * @example
   * res.location("back").;
   * @example
   * res.location("/foo/bar").;
   * @example
   * res.location("http://example.com");
   * @example
   * res.location("../login");
   */
  public location(url: string) {
    return this.set(
      "Location",
      encodeUrl(
        // "back" is an alias for the referrer
        url === "back" ? this.req.get("referer") || "/" : url,
      ),
    );
  }

  /**
   * Redirect to the given `url` with optional response `status`
   * defaulting to 302.
   *
   * The resulting `url` is determined by `res.location()`, so
   * it will play nicely with mounted apps, relative paths,
   * `"back"` etc.
   *
   * @example
   * res.redirect("/foo/bar");
   * @example
   * res.redirect("http://example.com");
   * @example
   * res.redirect("http://example.com", 301);
   * @example
   * res.redirect("../login"); // /blog/post/1 -> /blog/login
   */
  public redirect(url: string, status: httpStatus = HTTP.FOUND) {
    let body: string = "";

    // Set location header
    url = this.location(url).get("Location") as string;

    // Support text/{plain,html} by default
    this.format({
      default: () => (body = ""),
      html: () => {
        const u = escapeHtml(url);
        body = `<p>${
          STATUS_CODES[status]
        }. Redirecting to <a href="${u}">${u}</a></p>`;
      },
      text: () => (body = `${STATUS_CODES[status]}. Redirecting to ${url}`),
    });

    // Respond
    this.statusCode = status;
    // this.set("Content-Length", Buffer.byteLength(body) as any);

    if (this.req.method === "HEAD") this.end();
    else this.end(body);
  }

  /**
   * Add `field` to Vary. If already present in the Vary set, then
   * this call is simply ignored.
   *
   * @returns for chaining
   */
  public vary(field: string | string[]) {
    return vary(this, field);
  }

  public render(
    view: string,
    data?: object | Engine.Callback,
    callback?: Engine.Callback,
  ) {
    const engine = this.settings.engine!;

    assert(engine, "View engine is not specified");

    if (func.isFunction(data)) {
      callback = data;
      data = undefined;
    }

    if (!callback) {
      callback = (err, str) => {
        if (err) throw err;

        this.send(str);
      };
    }

    engine.render(view, data, callback);
  }
}

export default Response;
