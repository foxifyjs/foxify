import TypeAny from './Any'

class TypeArray extends TypeAny {
  protected _base(v: any = this._value): string | null {
    if (Array.isInstance(v)) return null

    return 'Must be an array'
  }

  min(n: number) {
    if (!Number.isInstance(n)) throw new TypeError('"n" must be a number')

    if (n < 0) throw new TypeError('"n" must be a positive number')

    return this._test(() => this._value.length < n ? `Must be at least ${n} items` : null)
  }

  max(n: number) {
    if (!Number.isInstance(n)) throw new TypeError('"n" must be a number')

    if (n < 0) throw new TypeError('"n" must be a positive number')

    return this._test(() => this._value.length > n ? `Must be at most ${n} items` : null)
  }

  length(n: number) {
    if (!Number.isInstance(n)) throw new TypeError('"n" must be a number')

    if (n < 0) throw new TypeError('"n" must be a positive number')

    return this._test(() => this._value.length != n ? `Must be exactly ${n} items` : null)
  }
}

export default TypeArray
