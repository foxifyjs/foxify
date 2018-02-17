import { TypeAny } from './Any'

class TypeArray extends TypeAny {
  protected _base(value: any) {
    if (Array.isInstance(value)) return null

    return 'Must be an array'
  }

  min(n: number) {
    if (n < 0) throw new TypeError('"n" must be a positive number')

    this._test((value) => value.length < n ? `Must be at least ${n} items` : null)

    return this
  }

  max(n: number) {
    if (n < 0) throw new TypeError('"n" must be a positive number')

    this._test((value) => value.length > n ? `Must be at most ${n} items` : null)

    return this
  }

  length(n: number) {
    if (n < 0) throw new TypeError('"n" must be a positive number')

    this._test((value) => value.length != n ? `Must be exactly ${n} items` : null)

    return this
  }
}

export { TypeArray }
export default new TypeArray
