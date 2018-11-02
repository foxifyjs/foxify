import { IncomingHttpHeaders, OutgoingHttpHeaders } from "http";

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
  return typeof timestamp === "number"
    ? timestamp
    : NaN;
};

/**
 * Parse a HTTP token list.
 *
 * @param {string} str
 * @private
 */
const parseTokenList = (str: string) => {
  const list = [];
  let start = 0;
  let end = 0;

  // gather tokens
  for (let i = 0, len = str.length; i < len; i++)
    switch (str.charCodeAt(i)) {
      case 0x20: /*   */
        if (start === end) start = end = i + 1;
        break;
      case 0x2c: /* , */
        list.push(str.substring(start, end));
        start = end = i + 1;
        break;
      default:
        end = i + 1;
        break;
    }

  // final token
  list.push(str.substring(start, end));

  return list;
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
  if (cacheControl && CACHE_CONTROL_NO_CACHE_REGEXP.test(cacheControl)) return false;

  // if-none-match
  if (noneMatch && noneMatch !== "*") return false;

  // if-modified-since
  if (modifiedSince && !lastModified || !(parseHttpDate(lastModified!) <= parseHttpDate(modifiedSince))) return false;

  return true;
};

export default fresh;
