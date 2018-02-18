class TypeAny {
  protected _tests: any[] = [this._base]

  protected _required: boolean = false

  protected _default?: any
  protected _value?: any

  protected _base(v: any = this._value): string | null {
    if (!Function.isInstance(v)) return null

    return 'Invalid type'
  }

  protected _test(test: () => string | null) {
    this._tests.push(test)

    return this
  }

  get required() {
    this._required = true

    return this
  }

  default(v: any) {
    if (this._base(v)) throw new TypeError(`The given value must be of "${this.constructor.name}" type`)

    this._default = v

    return this
  }

  // TODO whitelist
  allow(...vs: any[]) {
  }

  validate(value: any = this._default): { value: any, errors: string[] | null } {
    if (value == undefined) {
      if (this._required) return { errors: ['Must be provided'], value }

      return { errors: null, value }
    }

    this._value = value

    let errors: string[] = []

    this._tests.map((_test) => {
      errors.push(_test.call(this))
    })

    errors = errors.compact()

    if (errors.length == 0) return { errors: null, value: this._value }

    return {
      errors,
      value: this._value
    }
  }
}

export default TypeAny
