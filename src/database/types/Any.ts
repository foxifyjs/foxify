class TypeAny {
  protected _tests: any[] = [this._base]
  protected _default?: any

  protected _base(value: any): string | null {
    if (!Function.isInstance(value)) return null

    return 'Invalid type'
  }

  protected _test(test: (value: any) => string | null) {
    this._tests.push(test)

    return this
  }

  get required() {
    this._test((value) => !value ? 'Must be provided' : null)

    return this
  }

  default(value: any) {
    if (this._base(value)) throw new TypeError(`The given value must be a "${this.constructor.name}" type`)

    this._default = value

    return this
  }

  // TODO whitelist
  allow(...values: any[]) {
  }

  errors(value: any): string[] | null {
    let errors: any[] = []

    this._tests.map((_test) => {
      errors.push(_test(value))
    })

    errors = errors.distinct()

    if (errors.length > 0) return errors

    return null
  }
}


export { TypeAny }
export default new TypeAny
