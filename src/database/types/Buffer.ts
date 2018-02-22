import TypeAny from './Any'

class TypeBuffer extends TypeAny {
  protected _base(v: any) {
    if (Buffer.isBuffer(v)) return null

    return 'Must be a buffer'
  }

  // TODO
  // encoding(encoding: string) {
  // }

  min(n: number) {
    if (!Number.isInstance(n)) throw new TypeError('"n" must be a number')

    if (n < 0) throw new TypeError('"n" must be a positive number')

    return this._test((v: Buffer) => v.length < n ? `Size must be at least ${n}` : null)
  }

  max(n: number) {
    if (!Number.isInstance(n)) throw new TypeError('"n" must be a number')

    if (n < 0) throw new TypeError('"n" must be a positive number')

    return this._test((v: Buffer) => v.length > n ? `Size must be at most ${n}` : null)
  }

  length(n: number) {
    if (!Number.isInstance(n)) throw new TypeError('"n" must be a number')

    if (n < 0) throw new TypeError('"n" must be a positive number')

    return this._test((v: Buffer) => v.length != n ? `Size must be exactly ${n}` : null)
  }
}

export default TypeBuffer
