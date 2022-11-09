import { IncomingHttpHeaders, OutgoingHttpHeaders } from "node:http";

/**
 * RegExp to check for no-cache token in Cache-Control.
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control#max-age_2
 * @private
 */
const CACHE_CONTROL_NO_CACHE_REGEXP = /(?:^|,)\s*?(?:no-cache|max-age=0)\s*?(?:,|$)/;

/**
 * Parse an HTTP Date into a number.
 *
 * @private
 */
const parseHttpDate = Date.parse;

/**
 * Check if the etag matches the string.
 *
 * @private
 */
function compareETags(etag: string, str: string): boolean {
  return str === etag || str === `W/${ etag }` || `W/${ str }` === etag;
}

/**
 * Check if the request is stale.
 *
 * @private
 */
function isStale(etag: string, noneMatch: string): boolean {
  const length = noneMatch.length;
  let start = 0;
  let end = 0;

  for (let i = 0; i < length; i++) {
    switch (noneMatch.charCodeAt(i)) {
      case 0x20: /*   */
        if (start === end) start = end = i + 1;

        break;
      case 0x2c: /* , */
        if (compareETags(etag, noneMatch.slice(start, end))) return false;

        start = end = i + 1;

        break;
      default:
        end = i + 1;

        break;
    }
  }

  return !compareETags(etag, noneMatch.slice(start, end));
}

/**
 * Check freshness of the response using request and response headers.
 */
export default function fresh(
  reqHeaders: IncomingHttpHeaders,
  resHeaders: OutgoingHttpHeaders,
): boolean {
  // Fields
  const modifiedSince = reqHeaders["if-modified-since"];
  const noneMatch = reqHeaders["if-none-match"];

  // Unconditional request
  if (!modifiedSince && !noneMatch) return false;

  // Always return stale when Cache-Control: no-cache
  // to support end-to-end reload requests
  // https://tools.ietf.org/html/rfc2616#section-14.9.4
  const cacheControl = reqHeaders["cache-control"];
  if (cacheControl && CACHE_CONTROL_NO_CACHE_REGEXP.test(cacheControl)) return false;


  // If-none-match
  if (noneMatch && noneMatch !== "*") {
    const etag = resHeaders.etag as string | undefined;

    if (!etag || isStale(etag, noneMatch)) return false;
  }

  // If-modified-since
  if (modifiedSince) {
    const lastModified = resHeaders["last-modified"] as string | undefined;

    if (!lastModified || !(parseHttpDate(lastModified) <= parseHttpDate(modifiedSince))) return false;
  }

  return true;
}
