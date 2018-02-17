import { TypeAny } from './Any'

class TypeNumber extends TypeAny {
  protected _base(v: any) {
    if (Number.isInstance(v)) return null

    return 'Must be a number'
  }

  get integer() {
    return this._test((v: number) => v && !Number.isInteger(v) ? `Must be an integer` : null)
  }

  get positive() {
    return this._test((v: number) => v && v < 0 ? `Must be a positive number` : null)
  }

  get negative() {
    return this._test((v: number) => v && v > 0 ? `Must be a negative number` : null)
  }

  min(n: number) {
    return this._test((v: number) => v && v < n ? `Must be at least ${n}` : null)
  }

  max(n: number) {
    return this._test((v: number) => v && v > n ? `Must be at most ${n}` : null)
  }

  precision(n: number) {
    return this._test((v: number) => v && v.toString().split('.')[1].length < n ? `Must be have at most ${n} decimal places` : null)
  }

  multiple(n: number) {
    return this._test((v: number) => v && v % n != 0 ? `Must be a multiple of ${n}` : null)
  }
}

export { TypeNumber }
export default new TypeNumber
