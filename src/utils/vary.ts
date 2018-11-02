import * as Response from "../Response";

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
 * Append a field to a vary header.
 *
 * @param {String} header
 * @param {String|Array} field
 * @return {String}
 * @public
 */
const append = (header: string, field: string | string[]) => {
  if (!field) throw new TypeError("field argument is required");

  // get fields array
  const fields = !Array.isArray(field)
    ? parse(String(field))
    : field;

  // assert on invalid field names
  for (let j = 0; j < fields.length; j++)
    if (!FIELD_NAME_REGEXP.test(fields[j]))
      throw new TypeError("field argument contains an invalid header name");

  // existing, unspecified vary
  if (header === "*") return header;

  // enumerate current values
  const vals = parse(header.toLowerCase());
  let val = header;

  // unspecified vary
  if (fields.indexOf("*") !== -1 || vals.indexOf("*") !== -1) return "*";

  for (let i = 0; i < fields.length; i++) {
    const fld = fields[i].toLowerCase();

    // append value (case-preserving)
    if (vals.indexOf(fld) === -1) {
      vals.push(fld);

      val = val
        ? val + ", " + fields[i]
        : fields[i];
    }
  }

  return val;
};

/**
 * Parse a vary header into an array.
 *
 * @private
 */
const parse = (header: string) => {
  const list = [];
  let start = 0;
  let end = 0;

  // gather tokens
  for (let i = 0, len = header.length; i < len; i++)
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

  // final token
  list.push(header.substring(start, end));

  return list;
};

/**
 * Mark that a request is varied on a header field.
 *
 * @public
 */

function vary<T extends Response>(res: T, field: string | string[]): T {
  // get existing header
  let value = res.get("vary") || "";

  const header = Array.isArray(value)
    ? value.join(", ")
    : `${value}`;

  value = append(header, field);

  // set new header
  if (value) res.setHeader("vary", value);

  return res;
}

export default vary;
