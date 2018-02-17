import { TypeAny } from './Any'

class TypeDate extends TypeAny {
  protected _base(value: any) {
    if (Date.isInstance(value)) return null

    return 'Must be a date'
  }

  min(d: Date) {
    return this._test((value: Date) => value < d ? `Must be at least ${d}` : null)
  }

  max(d: Date) {
    this._test((value: Date) => value > d ? `Must be at most ${d}` : null)

    return this
  }
}

export { TypeDate }
export default new TypeDate
