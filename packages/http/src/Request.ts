import { IncomingHttpHeaders, IncomingMessage } from "http";
import { isIP } from "net";
import { UrlWithStringQuery } from "url";
import proxyAddr, { compile as proxyAddrCompile, all as proxyAddrAll } from "proxy-addr";
import * as qs from "qs";
import typeIs from "type-is";
import { MethodT, ProtocolT } from "./constants/index.js";
import {
  Accepts,
  parseUrl,
  RANGE_PARSER_RESULT,
  rangeParser,
  RangeParserRangesI,
} from "./utils/index.js";

// eslint-disable-next-line import/exports-last
export const DEFAULT_SETTINGS: SettingsI = {
  "query.parser"    : qs.parse,
  "trust.proxy"     : proxyAddrCompile([]),
  "subdomain.offset": 2,
};

const SETTINGS: SettingsI = { ...DEFAULT_SETTINGS };

export default class Request extends IncomingMessage {

  declare public readonly headers: HeadersI;

  declare public readonly method: MethodT;

  public readonly params: Record<string, unknown> = {};

  declare public readonly statusCode: undefined;

  declare public readonly statusMessage: undefined;

  declare public readonly url: string;

  protected _acceptsCache?: Accepts;

  protected _parsedUrl?: UrlWithStringQuery;

  protected _queryCache?: Record<string, unknown>;

  /**
   * Parse the "Host" header field to a hostname.
   *
   * When the "trust.proxy" setting trusts the socket
   * address, the "X-Forwarded-Host" header field will
   * be trusted.
   */
  public get hostname(): string | undefined {
    let host = this.get("x-forwarded-host");

    if (!host || !SETTINGS["trust.proxy"](this.socket.remoteAddress!, 0)) {
      host = this.get("host")!;
    } else if (host.includes(",")) {
      // Note: X-Forwarded-Host is normally only ever a
      //       single value, but this is to be safe.
      host = host.slice(0, host.indexOf(",")).trimRight();
    }

    if (!host) return;

    // IPv6 literal support
    const offset = host.startsWith("[") ? host.indexOf("]") + 1 : 0;

    const index = host.indexOf(":", offset);

    return index === -1 ? host : host.slice(0, index);
  }

  /**
   * Return the remote address from the trusted proxy.
   *
   * This is the remote address on the socket unless
   * "trust.proxy" is set.
   */
  public get ip(): string {
    return proxyAddr(this, SETTINGS["trust.proxy"]);
  }

  /**
   * When "trust.proxy" is set, trusted proxy addresses + client.
   *
   * For example if the value were "client, proxy1, proxy2"
   * you would receive the array `["client", "proxy1", "proxy2"]`
   * where "proxy2" is the furthest down-stream and "proxy1" and
   * "proxy2" were trusted.
   */
  public get ips(): string[] {
    const addresses = proxyAddrAll(this, SETTINGS["trust.proxy"]);

    // Reverse the order (to farthest -> closest)
    // and remove socket address
    addresses.reverse().pop();

    return addresses;
  }

  /**
   * Short-hand for `url.parseUrl(req.url).pathname`.
   */
  public get path(): string {
    return (this._parsedUrl ?? (this._parsedUrl = parseUrl(this.url)))
      .pathname!;
  }

  /**
   * Return the protocol string "http" or "https"
   * when requested with TLS. When the "trust.proxy"
   * setting trusts the socket address, the
   * "X-Forwarded-Proto" header field will be trusted
   * and used if present.
   *
   * If you're running behind a reverse proxy that
   * supplies https for you this may be enabled.
   */
  public get protocol(): ProtocolT {
    const proto = (this.socket as any).encrypted ? "https" : "http";

    if (!SETTINGS["trust.proxy"](this.socket.remoteAddress!, 0)) return proto;


    // Note: X-Forwarded-Proto is normally only ever a
    //       single value, but this is to be safe.
    const header = this.get("x-forwarded-proto") ?? proto;

    const index = header.indexOf(",");

    return index === -1 ? header.trim() : header.slice(0, index).trim();
  }

  public get query(): Record<string, unknown> {
    return (
      this._queryCache
      ?? (
        this._queryCache = SETTINGS["query.parser"]((this._parsedUrl ?? (this._parsedUrl = parseUrl(this.url))).query!)
      )
    );
  }

  /**
   * Short-hand for:
   *
   *    req.protocol === 'https'
   */
  public get secure(): boolean {
    return this.protocol === "https";
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
  public get subdomains(): string[] {
    const hostname = this.hostname;

    if (!hostname) return [];

    return (isIP(hostname) ? [hostname] : hostname.split(".").reverse()).slice(SETTINGS["subdomain.offset"]);
  }

  /**
   * Check if the request was an `_XMLHttpRequest_`.
   */
  public get xhr(): boolean {
    return (
      (this.get("x-requested-with") ?? "").toLowerCase() === "xmlhttprequest"
    );
  }

  protected get _accepts(): Accepts {
    return this._acceptsCache ?? (this._acceptsCache = new Accepts(this));
  }

  /**
   * Check if the given `type(s)` is acceptable, returning
   * the best match when true, otherwise `undefined`, in which
   * case you should respond with 406 "Not Acceptable".
   *
   * The `type` value may be a single MIME type string
   * such as "application/json", an extension name
   * such as "json", a comma-delimited list such as "json, html, text/plain",
   * an argument list such as `"json", "html", "text/plain"`,
   * When a list is given, the _best_ match, if any is returned.
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
   * req.accepts("html", "json");
   * req.accepts("html, json");
   * // => "json"
   */
  public accepts(...types: string[]): string[] | string | false {
    return this._accepts.types(types);
  }

  /**
   * Check if the given `charset`s are acceptable,
   * otherwise you should respond with 406 "Not Acceptable".
   */
  public acceptsCharsets(...charsets: string[]): string[] | string | false {
    return this._accepts.charsets(charsets);
  }

  /**
   * Check if the given `encoding`s are accepted.
   */
  public acceptsEncodings(...encodings: string[]): string[] | string | false {
    return this._accepts.encodings(encodings);
  }

  /**
   * Check if the given `language`s are acceptable,
   * otherwise you should respond with 406 "Not Acceptable".
   */
  public acceptsLanguages(...languages: string[]): string[] | string | false {
    return this._accepts.languages(languages);
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
  public get<Header extends Extract<keyof HeadersI, string>>(name: Header | Uppercase<Header>): HeadersI[Header] {
    name = name.toLowerCase() as Header;

    switch (name) {
      case "referer":
        return this.headers.referer ?? this.headers.referrer;
      case "referrer":
        return this.headers.referrer ?? this.headers.referer;
      default:
        return this.headers[name];
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
  public is(...types: string[]): string | false | null {
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
  public range(
    size: number,
    combine?: boolean,
  ): RANGE_PARSER_RESULT | RangeParserRangesI | undefined {
    const range = this.get("range");

    if (!range) return;

    return rangeParser(size, range, combine);
  }

}

// eslint-disable-next-line @typescript-eslint/no-shadow
export function settings(settings: Partial<SettingsI> = DEFAULT_SETTINGS): void {
  Object.assign(SETTINGS, settings);
}

export interface HeadersI extends IncomingHttpHeaders {
  referrer: IncomingHttpHeaders["referer"];
  "x-forwarded-host"?: string;
  "x-forwarded-proto"?: string;
  "x-requested-with"?: string;
}

export interface SettingsI {
  "subdomain.offset": number;
  "query.parser"(str: string): Record<string, unknown>;
  "trust.proxy"(ip: string, hopIndex: number): boolean;
}
