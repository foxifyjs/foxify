import { parse } from "url";
import * as Request from "../Request";

/**
 * Parse the `str` url with fast-path short-cut.
 *
 * @param {string} str
 * @return {Object}
 * @private
 */
const fastParse = (str: string) => {
  if (str.charCodeAt(0) !== 0x2f /* / */) return parse(str);

  let pathname = str;
  let query = null;
  let search = null;

  // This takes the regexp from https://github.com/joyent/node/pull/7878
  // Which is /^(\/[^?#\s]*)(\?[^#\s]*)?$/
  // And unrolls it into a for loop
  for (let i = 1; i < str.length; i++)
    switch (str.charCodeAt(i)) {
      case 0x3f: /* ?  */
        if (search === null) {
          pathname = str.substring(0, i);
          query = str.substring(i + 1);
          search = str.substring(i);
        }
        break;
      case 0x09: /* \t */
      case 0x0a: /* \n */
      case 0x0c: /* \f */
      case 0x0d: /* \r */
      case 0x20: /*    */
      case 0x23: /* #  */
      case 0xa0:
      case 0xfeff:
        return parse(str);
    }

  return {
    path: str,
    href: str,
    pathname,
    query,
    search,
  };
};

/**
 * Parse the `req` url with memoization.
 *
 * @param {ServerRequest} req
 * @return {Object}
 * @public
 */
const parseUrl = (req: Request) =>
  ((req as any)._parsedUrl = (req as any)._parsedUrl || fastParse(req.url as string));

export default parseUrl;
