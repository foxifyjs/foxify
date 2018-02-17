import { TypeAny } from './Any'

class TypeString extends TypeAny {
  protected _base(v: any) {
    if (String.isInstance(v)) return null

    return 'Must be a string'
  }

  get token() {
      return this._test((v) => !/^[a-zA-Z0-9_]*$/.test(v) ? `Must only contain a-z, A-Z, 0-9, and underscore _` : null)
  }

  // TODO
  get truncate() {
    return this
  }

  // TODO
  get alphanum() {
    return this
  }

  // TODO
  creditCard() {
    return this
  }

  // TODO
  email() {
    return this
  }

  // TODO
  ip() {
    return this
  }

  // TODO
  replace(pattern: string | RegExp, replacement: string) {
    return this
  }

  min(n: number) {
    if (n < 0) throw new TypeError('"n" must be a positive number')

    return this._test((v) => v.length < n ? `Must be at least ${n} characters` : null)
  }

  max(n: number) {
    if (n < 0) throw new TypeError('"n" must be a positive number')

    return this._test((v) => v.length > n ? `Must be at most ${n} characters` : null)
  }

  length(n: number) {
    if (n < 0) throw new TypeError('"n" must be a positive number')

    return this._test((v) => v.length != n ? `Must be exactly ${n} characters` : null)
  }

  regex(r: RegExp) {
    if (!(r instanceof RegExp)) throw new TypeError('"r" must be a regex')

    return this._test((v) => !r.test(v) ? `Must match ${r}` : null)
  }
}

export { TypeString }
export default new TypeString
