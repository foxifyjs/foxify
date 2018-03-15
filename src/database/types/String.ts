import TypeAny from "./Any";
import * as Verifications from "verifications";

// tslint:disable-next-line:max-line-length
const ipv4Regex = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/;
// tslint:disable-next-line:max-line-length
const ipv6Regex = /(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))/;

class TypeString extends TypeAny {
  protected _base(v: any) {
    if (String.isInstance(v)) return null;

    return "Must be a string";
  }

  /********** TESTS **********/

  get token() {
    return this._test((v: string) => !/^[a-zA-Z0-9_]*$/.test(v) ?
      `Must only contain a-z, A-Z, 0-9, and underscore _` : null);
  }

  get alphanum() {
    return this._test((v: string) => !/^[a-zA-Z0-9]*$/.test(v) ? `Must only contain a-z, A-Z, 0-9` : null);
  }

  get ip() {
    return this._test((v: string) => !(ipv4Regex.test(v) || ipv6Regex.test(v)) ? `Must be an ipv4 or ipv6` : null);
  }

  get ipv4() {
    return this._test((v: string) => !ipv4Regex.test(v) ? `Must be an ipv4` : null);
  }

  get ipv6() {
    return this._test((v: string) => !ipv6Regex.test(v) ? `Must be an ipv6` : null);
  }

  get email() {
    return this._test((v: string) => !/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(v) ? "Must be an email address" : null);
  }

  get creditCard() {
    return this._test((v: string) => !Verifications.CreditCard.verify(v) ? "Must be a credit-card" : null);
  }

  min(n: number) {
    if (!Number.isInstance(n)) throw new TypeError("'n' must be a number");

    if (n < 0) throw new TypeError("'n' must be a positive number");

    return this._test((v: string) => v.length < n ? `Must be at least ${n} characters` : null);
  }

  max(n: number) {
    if (!Number.isInstance(n)) throw new TypeError("'n' must be a number");

    if (n < 0) throw new TypeError("'n' must be a positive number");

    return this._test((v: string) => v.length > n ? `Must be at most ${n} characters` : null);
  }

  length(n: number) {
    if (!Number.isInstance(n)) throw new TypeError("'n' must be a number");

    if (n < 0) throw new TypeError("'n' must be a positive number");

    return this._test((v: string) => v.length !== n ? `Must be exactly ${n} characters` : null);
  }

  regex(r: RegExp) {
    if (!(r instanceof RegExp)) throw new TypeError("'r' must be a regex");

    return this._test((v: string) => !r.test(v) ? `Must match ${r}` : null);
  }

  /********** CASTS **********/

  truncate(length: number) {
    return this._cast((v: string) => v.truncate(length));
  }

  replace(pattern: string | RegExp, replacement: string) {
    return this._cast((v: string) => v.replace(pattern, replacement));
  }
}

export default TypeString;
