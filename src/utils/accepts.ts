import * as Negotiator from "negotiator";
import * as mime from "mime-types";
import * as Request from "../Request";
import { IncomingHttpHeaders } from "http";

/**
 * Convert extnames to mime.
 *
 * @param {String} type
 * @return {String}
 * @private
 */
const extToMime = (type: string) => type.indexOf("/") === -1
  ? mime.lookup(type)
  : type;

/**
 * Check if mime is valid.
 *
 * @param {String} type
 * @return {String}
 * @private
 */
const validMime = (type: string | false) => !!type;

class Accepts {
  protected headers: IncomingHttpHeaders;

  protected negotiator: Negotiator;

  constructor(req: Request) {
    this.headers = req.headers;
    this.negotiator = new Negotiator(req);
  }

  /**
   * Check if the given `type(s)` is acceptable, returning
   * the best match when true, otherwise `undefined`, in which
   * case you should respond with 406 "Not Acceptable".
   *
   * The `type` value may be a single mime type string
   * such as "application/json", the extension name
   * such as "json" or an array `["json", "html", "text/plain"]`. When a list
   * or array is given the _best_ match, if any is returned.
   *
   * Examples:
   *
   *     // Accept: text/html
   *     this.types("html");
   *     // => "html"
   *
   *     // Accept: text/*, application/json
   *     this.types("html");
   *     // => "html"
   *     this.types("text/html");
   *     // => "text/html"
   *     this.types("json", "text");
   *     // => "json"
   *     this.types("application/json");
   *     // => "application/json"
   *
   *     // Accept: text/*, application/json
   *     this.types("image/png");
   *     this.types("png");
   *     // => undefined
   *
   *     // Accept: text/*;q=.5, application/json
   *     this.types(["html", "json"]);
   *     this.types("html", "json");
   *     // => "json"
   */
  types(types: string[]) {
    // no types, return all requested types
    if (!types || types.length === 0) return this.negotiator.mediaTypes();

    // no accept header, return first given type
    if (!this.headers.accept) return types[0];

    const mimes = types.map(extToMime);
    const first = this.negotiator.mediaTypes(mimes.filter(validMime) as string[])[0];

    return first
      ? types[mimes.indexOf(first)]
      : false;
  }

  /**
   * Return accepted encodings or best fit based on `encodings`.
   *
   * Given `Accept-Encoding: gzip, deflate`
   * an array sorted by quality is returned:
   *
   *     ["gzip", "deflate"]
   */
  encodings(encodings: string[]) {
    // no encodings, return all requested encodings
    if (!encodings || encodings.length === 0) return this.negotiator.encodings();

    return this.negotiator.encodings(encodings)[0] || false;
  }

  /**
   * Return accepted charsets or best fit based on `charsets`.
   *
   * Given `Accept-Charset: utf-8, iso-8859-1;q=0.2, utf-7;q=0.5`
   * an array sorted by quality is returned:
   *
   *     ["utf-8", "utf-7", "iso-8859-1"]
   */
  charsets(charsets: string[]) {
    // no charsets, return all requested charsets
    if (!charsets || charsets.length === 0) return this.negotiator.charsets();

    return this.negotiator.charsets(charsets)[0] || false;
  }

  /**
   * Return accepted languages or best fit based on `langs`.
   *
   * Given `Accept-Language: en;q=0.8, es, pt`
   * an array sorted by quality is returned:
   *
   *     ["es", "pt", "en"]
   *
   * @param {String|Array} langs...
   * @return {Array|String}
   * @public
   */
  languages(languages: string[]) {
    // no languages, return all requested languages
    if (!languages || languages.length === 0) return this.negotiator.languages();

    return this.negotiator.languages(languages)[0] || false;
  }
}

export default Accepts;
