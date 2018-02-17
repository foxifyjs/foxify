import { TypeAny } from './Any'

class TypeBuffer extends TypeAny {
  protected _base(value: any) {
    if (Buffer.isBuffer(value)) return null

    return 'Must be a buffer'
  }

  // TODO
  encoding(encoding: string) {
  }

  min(n: number) {
    if (n < 0) throw new TypeError('"n" must be a positive number')

    this._test((value) => value.length < n ? `Size must be at least ${n}` : null)

    return this
  }

  max(n: number) {
    if (n < 0) throw new TypeError('"n" must be a positive number')

    this._test((value) => value.length > n ? `Size must be at most ${n}` : null)

    return this
  }

  length(n: number) {
    if (n < 0) throw new TypeError('"n" must be a positive number')

    this._test((value) => value.length != n ? `Size must be exactly ${n}` : null)

    return this
  }
}

export { TypeBuffer }
export default new TypeBuffer
