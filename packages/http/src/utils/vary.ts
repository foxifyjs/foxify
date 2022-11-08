/**
 * (The MIT License)
 *
 * Copyright (c) 2014-2017 Douglas Christopher Wilson
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

import assert from "assert";
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import type Response from "../Response";

/**
 * RegExp to match field-name in RFC 7230 sec 3.2
 *
 * field-name    = token
 * token         = 1*tchar
 * tchar         = "!" / "#" / "$" / "%" / "&" / "'" / "*"
 *               / "+" / "-" / "." / "^" / "_" / "`" / "|" / "~"
 *               / DIGIT / ALPHA
 *               ; any VCHAR, except delimiters
 */
const FIELD_NAME_REGEXP = /^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/;

/**
 * Parse a vary header into an array.
 *
 * @private
 */
const parse = (header: string): any[] => {
  const list = [];
  let start = 0;
  let end = 0;

  // Gather tokens
  for (let i = 0, len = header.length; i < len; i++) {
    switch (header.charCodeAt(i)) {
      case 0x20: /*   */
        if (start === end) start = end = i + 1;
        break;
      case 0x2c: /* , */
        list.push(header.substring(start, end));
        start = end = i + 1;
        break;
      default:
        end = i + 1;
        break;
    }
  }

  // Final token
  list.push(header.substring(start, end));

  return list;
};

/**
 * Append a field to a vary header.
 *
 * @param {String} header
 * @param {String|Array} field
 * @return {String}
 * @public
 */
const append = (header: string, field: string[] | string): string => {
  // Get fields array
  const fields = Array.isArray(field) ? field : parse(String(field));

  // Assert on invalid field names
  // eslint-disable-next-line @typescript-eslint/prefer-for-of
  for (let j = 0; j < fields.length; j++) {
    assert(
      FIELD_NAME_REGEXP.test(fields[j]),
      "Argument 'field' contains an invalid header name",
    );
  }

  // Existing, unspecified vary
  if (header === "*") return header;

  // Enumerate current values
  const vals = parse(header.toLowerCase());
  let val = header;

  // Unspecified vary
  if (fields.includes("*") || vals.includes("*")) return "*";

  // eslint-disable-next-line @typescript-eslint/prefer-for-of
  for (let i = 0; i < fields.length; i++) {
    const fld = fields[i].toLowerCase();

    // Append value (case-preserving)
    if (!vals.includes(fld)) {
      vals.push(fld);

      val = val ? `${ val }, ${ fields[i] }` : fields[i];
    }
  }

  return val;
};

/**
 * Mark that a request is varied on a header field.
 *
 * @public
 */

function vary<T extends Response>(res: T, field: string[] | string): T {
  // Get existing header
  let value = res.get("vary") ?? "";

  const header = Array.isArray(value) ? value.join(", ") : `${ value }`;

  value = append(header, field);

  // Set new header
  if (value) res.setHeader("vary", value);

  return res;
}

export default vary;
