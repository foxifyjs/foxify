/**
 * Copyright (c) 2014-2018, Project contributors.
 * Copyright (c) 2015-2016, Mark Bradshaw
 * Copyright (c) 2014, Walmart.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * The names of any contributors may not be used to endorse or promote
 *       products derived from this software without specific prior written
 *       permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDERS AND CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

/**
 * This module is modified and optimized for Foxify specifically
 */

import * as mime from "mime-types";
import Negotiator from "negotiator";
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import type { default as Request, HeadersI } from "../Request.js";

/**
 * Convert extnames to mime.
 *
 * @param {String} type
 * @return {String}
 * @private
 */
const extToMime = (type: string): boolean | string => (type.includes("/") ? type : mime.lookup(type));

class Accepts {

  protected headers: HeadersI;

  protected negotiator: Negotiator;

  public constructor(req: Request) {
    this.headers = req.headers;
    this.negotiator = new Negotiator(req);
  }

  /**
   * Return accepted charsets or best fit based on `charsets`.
   *
   * Given `Accept-Charset: utf-8, iso-8859-1;q=0.2, utf-7;q=0.5`
   * an array sorted by quality is returned:
   *
   *     ["utf-8", "utf-7", "iso-8859-1"]
   */
  public charsets(charsets: string[] = []): string[] | string | false {
    // No charsets, return all requested charsets
    if (charsets.length === 0) return this.negotiator.charsets();

    return this.negotiator.charsets(charsets)[0] || false;
  }

  /**
   * Return accepted encodings or best fit based on `encodings`.
   *
   * Given `Accept-Encoding: gzip, deflate`
   * an array sorted by quality is returned:
   *
   *     ["gzip", "deflate"]
   */
  public encodings(encodings: string[] = []): string[] | string | false {
    // No encodings, return all requested encodings
    if (encodings.length === 0) return this.negotiator.encodings();


    return this.negotiator.encodings(encodings)[0] || false;
  }

  /**
   * Return accepted languages or best fit based on `langs`.
   *
   * Given `Accept-Language: en;q=0.8, es, pt`
   * an array sorted by quality is returned:
   *
   *     ["es", "pt", "en"]
   *
   * @param {String|Array} languages...
   * @return {Array|String}
   * @public
   */
  public languages(languages: string[] = []): string[] | string | false {
    // No languages, return all requested languages
    if (languages.length === 0) return this.negotiator.languages();


    return this.negotiator.languages(languages)[0] || false;
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
   * @example
   * // Accept: text/html
   * this.types("html");
   * // => "html"
   *
   * @example
   * // Accept: text/*, application/json
   * this.types("html");
   * // => "html"
   * this.types("text/html");
   * // => "text/html"
   * this.types("json", "text");
   * // => "json"
   * this.types("application/json");
   * // => "application/json"
   *
   * @example
   * // Accept: text/*, application/json
   * this.types("image/png");
   * this.types("png");
   * // => undefined
   *
   * @example
   * // Accept: text/*;q=.5, application/json
   * this.types(["html", "json"]);
   * this.types("html", "json");
   * // => "json"
   */
  public types(types: string[] = []): string[] | string | false {
    // No types, return all requested types
    if (types.length === 0) return this.negotiator.mediaTypes();

    // No accept header, return first given type
    if (!this.headers.accept) return types[0];

    const mimes = types.map(extToMime);
    const first = this.negotiator.mediaTypes(mimes.filter(Boolean) as string[])[0];

    return first ? types[mimes.indexOf(first)] : false;
  }

}

export default Accepts;
