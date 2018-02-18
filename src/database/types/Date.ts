import TypeAny from './Any'

class TypeDate extends TypeAny {
  protected _base(v: any = this._value) {
    if (Date.isInstance(v)) return null

    return 'Must be a date'
  }

  min(d: Date) {
    return this._test(() => this._value < d ? `Must be at least ${d}` : null)
  }

  max(d: Date) {
    return this._test(() => this._value > d ? `Must be at most ${d}` : null)
  }
}

export default TypeDate
