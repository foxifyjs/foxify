/**
 * (The MIT License)
 *
 * Copyright (c) 2012 TJ Holowaychuk <tj@vision-media.ca>
 * Copyright (c) 2016-2017 Douglas Christopher Wilson <doug@somethingdoug.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * 'Software'), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
 * CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 * TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

/**
 * This module is modified and optimized for Foxify specifically
 */

import { IncomingHttpHeaders } from "http";

/**
 * RegExp to check for no-cache token in Cache-Control.
 * @private
 */
const CACHE_CONTROL_NO_CACHE_REGEXP = /(?:^|,)\s*?no-cache\s*?(?:,|$)/;

/**
 * Parse an HTTP Date into a number.
 *
 * @param {string} date
 * @private
 */
const parseHttpDate = (date: string) => {
  const timestamp = date && Date.parse(date);

  // istanbul ignore next: guard against date.js Date.parse patching
  return typeof timestamp === "number" ? timestamp : NaN;
};

/**
 * Check freshness of the response using request and response headers.
 *
 * @param {Object} reqHeaders
 * @param {Object} resHeaders
 * @return {Boolean}
 * @public
 */
const fresh = (reqHeaders: IncomingHttpHeaders, lastModified?: string) => {
  // fields
  const modifiedSince = reqHeaders["if-modified-since"] as string;
  const noneMatch = reqHeaders["if-none-match"] as string;

  // unconditional request
  if (!modifiedSince && !noneMatch) return false;

  // Always return stale when Cache-Control: no-cache
  // to support end-to-end reload requests
  // https://tools.ietf.org/html/rfc2616#section-14.9.4
  const cacheControl = reqHeaders["cache-control"];
  if (cacheControl && CACHE_CONTROL_NO_CACHE_REGEXP.test(cacheControl)) {
    return false;
  }

  // if-none-match
  if (noneMatch && noneMatch !== "*") return false;

  // if-modified-since
  if (
    (modifiedSince && !lastModified) ||
    !(parseHttpDate(lastModified!) <= parseHttpDate(modifiedSince))
  ) {
    return false;
  }

  return true;
};

export default fresh;
