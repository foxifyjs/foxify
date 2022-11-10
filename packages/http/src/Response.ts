import assert from "assert";
import { OutgoingHttpHeaders, ServerResponse, STATUS_CODES } from "http";
import { extname, resolve } from "path";
import fresh from "@foxify/fresh";
import contentDisposition from "content-disposition";
import * as contentType from "content-type";
import * as cookie from "cookie";
import { sign } from "cookie-signature";
import escapeHtml from "escape-html";
import onFinished from "on-finished";
import send, { mime as sendMime } from "send";
import Request from "./Request";
import { JsonT, METHOD, STATUS, StatusT, StringifyT } from "./constants";
import { createETagGenerator, encodeUrl, vary } from "./utils";
import { CallbackT as EngineCallbackT, Engine } from "./view";

/**
 * Set the charset in a given Content-Type string.
 *
 * @param {String} type
 * @param {String} charset
 * @return {String}
 * @api private
 */
const setCharset = (type?: string, charset?: string): string | undefined => {
  if (!type || !charset) return type;

  // Parse type
  const parsed = contentType.parse(type);

  // Set charset
  parsed.parameters.charset = charset;

  // Format type
  return contentType.format(parsed);
};

/**
 * Stringify JSON, like JSON.stringify, but v8 optimized, with the
 * ability to escape characters that can trigger HTML sniffing.
 *
 * @param {StringifyT} stringifier
 * @param {*} value
 * @param {function} replacer
 * @param {number} spaces
 * @param {boolean} escape
 * @returns {string}
 * @private
 */
const stringify = (
  // eslint-disable-next-line @typescript-eslint/default-param-last
  stringifier: StringifyT = JSON.stringify,
  value: any,
  replacer?: (key: string, value: any) => any,
  spaces?: number,
  escape?: boolean,
  // eslint-disable-next-line max-params
): string => {
  // TODO: v8 checks arguments.length for optimizing simple call
  // https://bugs.chromium.org/p/v8/issues/detail?id=4730

  if (!escape) return stringifier(value, replacer, spaces);

  return stringifier(value, replacer, spaces).replace(/[<>&]/g, (c) => {
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
const isAbsolute = (path: string): boolean => {
  if (path.startsWith("/")) return true;

  // Windows device path
  if (path[1] === ":" && (path[2] === "\\" || path[2] === "/")) return true;

  // Microsoft Azure absolute path
  if (path.startsWith("\\\\")) return true;

  return false;
};

/**
 * Pipe the send file stream
 */
const sendfile = (
  res: Response,
  file: send.SendStream,
  options: Record<string, unknown>,
  callback: (...args: any[]) => void,
  // eslint-disable-next-line max-params
): void => {
  let done = false;
  let streaming: boolean;

  // Request aborted
  function onaborted(): void {
    if (done) return;

    done = true;

    const err = new Error("Request aborted");

    (err as any).code = "ECONNABORTED";

    callback(err);
  }

  // Directory
  function ondirectory(): void {
    if (done) return;

    done = true;

    const err = new Error("EISDIR, read");

    (err as any).code = "EISDIR";

    callback(err);
  }

  // Errors
  function onerror(err: Error): void {
    if (done) return;

    done = true;

    callback(err);
  }

  // Ended
  function onend(): void {
    if (done) return;

    done = true;

    callback();
  }

  // File
  function onfile(): void {
    streaming = false;
  }

  // Finished
  function onfinish(err: any): void {
    if (err && err.code === "ECONNRESET") {
      onaborted();

      return;
    }
    if (err) {
      onerror(err);

      return;
    }
    if (done) return;

    setImmediate(() => {
      if (streaming && !done) {
        onaborted();
        return;
      }

      if (done) return;

      done = true;

      callback();
    });
  }

  // Streaming
  function onstream(): void {
    streaming = true;
  }

  file.on("directory", ondirectory);
  file.on("end", onend);
  file.on("error", onerror);
  file.on("file", onfile);
  file.on("stream", onstream);

  onFinished(res, onfinish);

  if ((options as any).headers) {
    // Set headers on successful transfer
    // eslint-disable-next-line @typescript-eslint/no-shadow
    file.on("headers", (res: Response) => {
      const obj = (options as any).headers;
      const keys = Object.keys(obj);

      let k;
      // eslint-disable-next-line @typescript-eslint/prefer-for-of
      for (let i = 0; i < keys.length; i++) {
        k = keys[i];

        res.setHeader(k, obj[k]);
      }
    });
  }

  // Pipe
  file.pipe(res);
};

/**
 * Parse accept params `str` returning an
 * object with `.value`, `.quality` and `.params`.
 * also includes `.originalIndex` for stable sorting
 *
 * @param {String} str
 * @param index
 * @return {Object}
 * @api private
 */
const acceptParams = (str: string, index?: number): Record<string, any> => {
  const parts = str.split(/ *; */);

  const ret = {
    originalIndex: index,
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    params       : {} as Record<string, any>,
    quality      : 1,
    value        : parts[0],
  };

  let pms;
  for (let i = 1; i < parts.length; ++i) {
    pms = parts[i].split(/ *= */);

    if (pms[0] === "q") ret.quality = parseFloat(pms[1]);
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
const normalizeType = (type: string): Record<string, any> => (~type.indexOf("/")
  ? acceptParams(type)
  : {
      value : (sendMime as any).lookup(type),
      params: {},
    });

/**
 * Normalize `types`, for example "html" becomes "text/html".
 *
 * @param {Array} types
 * @return {Array}
 * @api private
 */
const normalizeTypes = (types: string[]): any[] => {
  const ret = [];

  // eslint-disable-next-line @typescript-eslint/prefer-for-of
  for (let i = 0; i < types.length; ++i) ret.push(normalizeType(types[i]));

  return ret;
};

// eslint-disable-next-line import/exports-last
export const DEFAULT_SETTINGS: SettingsI = {
  etag            : createETagGenerator(true),
  "json.escape"   : false,
  "jsonp.callback": "callback",
};

const SETTINGS: SettingsI = { ...DEFAULT_SETTINGS };

const hasOwnProperty = Object.prototype.hasOwnProperty;

const charsetRegExp = /;\s*charset\s*=/;

interface Response extends ServerResponse {

  /**
   * Get value for header `header`.
   *
   * @alias getHeader
   */
  get<T extends keyof HeadersI>(header: T): HeadersI[T];

  getHeader<T extends keyof HeadersI>(header: T): HeadersI[T];

  /**
   * @alias header
   */
  set<T extends string>(header: T, value: HeadersI[T] | number[]): this;

  set(headers: { [Header in string]: HeadersI[Header] | number[] }): this;

  /**
   * @alias contentType
   */
  type(type: string): this;
}

class Response extends ServerResponse<Request> {

  // TODO: try eliminating the need to this function here
  public next!: (error?: Error) => void;

  // TODO: don't reference request in the response instance
  public readonly req: Request;

  declare public statusCode: StatusT;

  public stringify!: {
    [statusCode in StatusT]?: StringifyT;
  };

  public constructor(req: Request) {
    super(req);

    this.req = req;
  }

  /**
   * Check if the request is fresh, aka
   * Last-Modified and/or the ETag
   * still match.
   */
  public get fresh(): boolean {
    const req = this.req;
    const method = req.method;

    // GET or HEAD for weak freshness validation only
    if (METHOD.GET !== method && METHOD.HEAD !== method) return false;

    const status = this.statusCode;

    // 2xx or 304 as per rfc2616 14.26
    if (
      (status >= STATUS.OK && status < STATUS.MULTIPLE_CHOICES)
      || STATUS.NOT_MODIFIED === status
    ) {
      return fresh(req.headers, {
        etag           : this.get("etag"),
        "last-modified": this.getHeader("last-modified"),
      });
    }

    return false;
  }

  /**
   * Check if the request is stale, aka
   * "Last-Modified" and / or the "ETag" for the
   * resource has changed.
   */
  public get stale(): boolean {
    return !this.fresh;
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
  public append(field: string, value: string[] | string): this {
    const prev = this.get(field) as string[] | string;

    if (prev) {
      // Concat the new and prev vals
      value = Array.isArray(prev)
        ? prev.concat(value)
        : Array.isArray(value)
          ? [prev].concat(value)
          : [prev, value];
    }

    return this.set(field, value);
  }

  /**
   * Set _Content-Disposition_ header to _attachment_ with optional `filename`.
   */
  public attachment(filename?: string): this {
    if (filename) this.type(extname(filename));

    return this.set("Content-Disposition", contentDisposition(filename));
  }

  /**
   * Clear cookie `name`.
   *
   * @returns for chaining
   */
  public clearCookie(
    name: string,
    options: Record<string, unknown> = {},
  ): this {
    return this.cookie(
      name,
      "",
      {
        expires: new Date(1),
        path   : "/",
        ...options,
      },
    );
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
  public contentType(type: string): this {
    return this.set(
      "Content-Type",
      type.includes("/") ? type : (sendMime as any).lookup(type),
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
    value: Record<string, unknown> | number | string,
    options: {
      [option: string]: any;
      maxAge?: number;
      path?: string;
      signed?: boolean;
    } = {},
  ): this {
    options = { ...options };

    const secret = (this.req as any).secret;
    const signed = options.signed;

    assert(
      !signed || secret,
      "cookieParser('secret') required for signed cookies",
    );

    const typeOfValue = typeof value;
    value
      = typeOfValue === "string" || typeOfValue === "number"
        ? `${ value }`
        : `j:${ JSON.stringify(value) }`;

    if (signed) value = `s:${ sign(value, secret) }`;

    // eslint-disable-next-line no-undefined
    if (options.maxAge !== undefined) {
      options.expires = new Date(Date.now() + options.maxAge);
      options.maxAge /= 1000;
    }

    if (!options.path) options.path = "/";

    return this.append("Set-Cookie", cookie.serialize(name, value, options));
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
    options: Record<string, unknown>,
    callback?: (...args: any[]) => void,
  ): void;
  // eslint-disable-next-line max-params
  public download(
    path: string,
    filename?: string | ((...args: any[]) => void),
    options: Record<string, unknown> | ((...args: any[]) => void) = {},
    callback?: (...args: any[]) => void,
  ): void {
    if (typeof filename === "function") {
      callback = filename;
      // eslint-disable-next-line no-undefined
      filename = undefined;
    } else if (typeof options === "function") {
      callback = options;
      options = {};
    }

    // Support function as second or third arg

    // set Content-Disposition when file is sent
    const headers: Record<string, any> = {
      "Content-Disposition": contentDisposition(filename ?? path),
    };

    // Merge user-provided headers
    if ((options as Record<string, any>).headers) {
      const keys = Object.keys((options as Record<string, any>).headers);

      let key;
      // eslint-disable-next-line @typescript-eslint/prefer-for-of
      for (let i = 0; i < keys.length; i++) {
        key = keys[i];

        if (key.toLowerCase() !== "content-disposition") headers[key] = (options as Record<string, any>).headers[key];
      }
    }

    // Merge user-provided options
    options = {
      ...options,
      headers,
    };

    // Resolve the full path for sendFile
    const fullPath = resolve(path);

    // Send file
    this.sendFile(
      fullPath,
      options as Record<string, unknown>,
      callback,
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
  public format(types: Record<string, ((req: Request, res: Response, next: () => void) => void) | undefined>): this {
    const req = this.req;
    const next = this.next;

    const fn = types.default;

    if (fn) delete types.default;

    const keys = Object.keys(types);

    const key = keys.length > 0 ? (req.accepts(...keys) as string) : false;

    this.vary("Accept");

    if (key) {
      this.set("content-type", normalizeType(key).value);
      types[key]!(req, this, next);
    } else if (fn) {
      fn(req, this, next);
    } else {
      const err: any = new Error("Not Acceptable");

      err.status = err.statusCode = 406;
      err.types = normalizeTypes(keys).map(o => o.value);

      next(err);
    }

    return this;
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
  public header<T extends string>(
    header: T,
    value: HeadersI[T] | number[],
  ): this;
  public header(
    headers: { [Header in string]: HeadersI[Header] | number[] },
  ): this;
  public header(
    field: Record<string, unknown> | string,
    value?: number[] | string[] | number | string,
  ): this {
    if (typeof field !== "string") {
      for (const key in field) {
        if (!hasOwnProperty.call(field, key)) continue;

        this.header(key, (field as any)[key]);
      }

      return this;
    }

    value = Array.isArray(value) ? (value as string[]).map(String) : `${ value }`;

    // Add charset to content-type
    if (field.toLowerCase() === "content-type") {
      if (!charsetRegExp.test(value as string)) {
        const charset = (sendMime as any).charsets.lookup((value as string).split(";")[0]);

        if (charset) value += `; charset=${ charset.toLowerCase() }`;
      }
    }

    this.setHeader(field, value as string[] | string);

    return this;
  }

  /**
   * Send JSON response.
   *
   * @example
   * res.json({ user: "tj" });
   */
  public json(body: JsonT): this {
    const encoding = "utf-8";
    const type = this.get("content-type");

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    if (typeof type === "string") this.setHeader("Content-Type", setCharset(type, encoding)!);
    else this.setHeader("Content-Type", "application/json; charset=utf-8");

    const {
      "json.replacer": replacer,
      "json.spaces": spaces,
      "json.escape": escape,
    } = SETTINGS;

    return this.#send(
      stringify(
        this.stringify[this.statusCode],
        body,
        replacer,
        spaces,
        escape,
      ),
      encoding,
    );
  }

  /**
   * Send JSON response with JSONP callback support.
   *
   * @example
   * res.jsonp({ user: "tj" });
   */
  public jsonp(body: JsonT): this {
    // Settings
    const {
      "json.replacer": replacer,
      "json.spaces": spaces,
      "json.escape": escape,
      "jsonp.callback": callbackName,
    } = SETTINGS;

    let str = stringify(
      this.stringify[this.statusCode],
      body,
      replacer,
      spaces,
      escape,
    );
    let callback = this.req.query[callbackName];

    // Content-type
    if (!this.get("content-type")) {
      this.set("x-content-type-options", "nosniff");
      this.set("content-type", "application/json");
    }

    // Fixup callback
    if (Array.isArray(callback)) callback = callback[0];

    // Jsonp
    if (typeof callback === "string" && callback.length !== 0) {
      this.set("x-content-type-options", "nosniff");
      this.set("content-type", "text/javascript");

      // Restrict callback charset
      callback = callback.replace(/[^[\]\w$.]/g, "");

      // Replace chars not allowed in JavaScript that are in JSON
      str = str.replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");

      // The /**/ is a specific security mitigation for "Rosetta Flash JSONP abuse"
      // the typeof check is just to reduce client error noise
      str = `/**/ typeof ${ callback }  === 'function' && ${ callback }(${ str });`;
    }

    return this.send(str);
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
  public links(links: Record<string, string>): this {
    let link = this.get("link") ?? "";

    if (link) link += ", ";

    return this.set(
      "link",
      `${ link }${ Object.keys(links)
        .map(rel => `<${ links[rel] }>; rel="${ rel }"`)
        .join(", ") }`,
    );
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
  public location(url: string): this {
    return this.set(
      "Location",

      // "back" is an alias for the referrer
      encodeUrl(url === "back" ? this.req.get("referrer") ?? "/" : url),
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
  public redirect(url: string, status: StatusT = STATUS.FOUND): void {
    let body = "";

    // Set location header
    url = this.location(url).get("Location") as string;

    // Support text/{plain,html} by default
    this.format({
      default: () => (body = ""),
      html   : () => {
        const u = escapeHtml(url);
        body = `<p>${ STATUS_CODES[status] }. Redirecting to <a href="${ u }">${ u }</a></p>`;
      },
      text: () => (body = `${ STATUS_CODES[status] }. Redirecting to ${ url }`),
    });

    // Respond
    this.statusCode = status;
    this.set("content-length", Buffer.byteLength(body));

    if (this.req.method === METHOD.HEAD) this.end();
    else this.end(body);
  }

  public render(
    view: string,
    data?: EngineCallbackT | Record<string, unknown>,
    callback?: EngineCallbackT,
  ): void {
    const { view: engine } = SETTINGS;

    assert(engine, "View engine is not specified");

    if (typeof data === "function") {
      callback = data;
      // eslint-disable-next-line no-undefined
      data = undefined;
    }

    if (!callback) {
      callback = (err, str): void => {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (err != null) {
          this.next(err);

          return;
        }

        this.send(str);
      };
    }

    engine.render(view, data, callback);
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
  public send(body?: Buffer | JsonT | string): this {
    let encoding: BufferEncoding | undefined;

    if (typeof body === "string") {
      encoding = "utf-8";
      const type = this.get("content-type");

      // Reflect this in content-type
      if (typeof type === "string") this.set("Content-Type", setCharset(type, encoding));
      else this.set("Content-Type", setCharset("text/html", encoding));
    } else if (Buffer.isBuffer(body)) {
      if (!this.hasHeader("content-type")) this.type("bin");
    } else if (body === null) {
      return this.#send("");
      // eslint-disable-next-line no-undefined
    } else if (body !== undefined) {
      return this.json(body);
    }

    return this.#send(body, encoding);
  }

  /**
   * Finalize the response.
   * @param body
   * @param encoding
   * @private
   */
  #send(body?: Buffer | string, encoding?: BufferEncoding): this {
    // eslint-disable-next-line no-undefined
    if (body !== undefined) {
      const { etag } = SETTINGS;

      if (etag && !this.hasHeader("etag")) {
        const generatedETag = etag(body, encoding);

        if (generatedETag) this.setHeader("ETag", generatedETag);
      }
    }

    // Freshness
    if (this.fresh) this.statusCode = STATUS.NOT_MODIFIED;

    const { statusCode } = this;

    // Strip irrelevant headers
    if (
      STATUS.NO_CONTENT === statusCode
      || STATUS.NOT_MODIFIED === statusCode
    ) {
      this.removeHeader("content-type");
      this.removeHeader("content-length");
      this.removeHeader("transfer-encoding");

      body = "";
    }

    // Skip body for HEAD
    if (this.req.method === METHOD.HEAD) this.end();
    else this.end(body, encoding as any);

    return this;
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
    options: Record<string, unknown>,
    callback?: (...args: any[]) => void,
  ): void;
  public sendFile(
    path: string,
    options: Record<string, unknown> | ((...args: any[]) => void) = {},
    callback?: (...args: any[]) => void,
  ): void {
    if (typeof options === "function") {
      callback = options;
      options = {};
    }

    assert(path, "Argument 'path' is required to res.sendFile");

    // Support function as second arg

    assert(
      options.root || isAbsolute(path),
      "Path must be absolute or specify root to res.sendFile",
    );

    // Create file stream
    const pathname = encodeURI(path);
    const file = send(this.req, pathname, options);

    // Transfer
    sendfile(this, file, options, (err: any) => {
      if (callback) {
        callback(err);

        return;
      }
      if (err && err.code === "EISDIR") {
        this.next();

        return;
      }

      // Next() all but write errors
      if (err && err.code !== "ECONNABORTED" && err.syscall !== "write") this.next(err);
    });
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
  public sendStatus(statusCode: StatusT): this {
    return this.status(statusCode)
      .type("txt")
      .send(STATUS_CODES[statusCode] ?? `${ statusCode }`);
  }

  /**
   * Set response status code.
   *
   * @example
   * res.status(500);
   */
  public status(statusCode: StatusT): this {
    this.statusCode = statusCode;

    return this;
  }

  /**
   * Add `field` to Vary. If already present in the Vary set, then
   * this call is simply ignored.
   *
   * @returns for chaining
   */
  public vary(field: string[] | string = []): this {
    return vary(this, field);
  }

}

Response.prototype.type = Response.prototype.contentType;
Response.prototype.set = Response.prototype.header;
Response.prototype.get = Response.prototype.getHeader;

export default Response;

// eslint-disable-next-line @typescript-eslint/no-shadow
export function settings(settings: Partial<SettingsI> = DEFAULT_SETTINGS): void {
  Object.assign(SETTINGS, settings);
}

export interface HeadersI extends OutgoingHttpHeaders {
  "Content-Type"?: string;
}

export interface SettingsI {
  "json.escape": boolean;
  "json.spaces"?: number;
  "jsonp.callback": string;
  view?: Engine;

  etag?(
    body: Buffer | string,
    encoding?: BufferEncoding,
  ): string | undefined;

  "json.replacer"?(key: string, value: any): any;

}
