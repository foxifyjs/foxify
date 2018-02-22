import * as async from 'async'

class TypeAny {
  protected _casts: Array<(v: any) => any> = []
  protected _tests: Array<(v: any) => string | null> = [this._base]

  protected _required: boolean = false

  protected _default?: any

  protected _base(v: any): string | null {
    if (!Function.isInstance(v)) return null

    return 'Invalid type'
  }

  protected _cast(test: (v: any) => any) {
    this._casts.push(test)

    return this
  }

  protected _test(test: (v: any) => string | null) {
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

    this._casts.map((_cast) => value = _cast(value))

    let errors: string[] = []

    async.map(
      this._tests,
      (test, cb1: Function) => cb1(undefined, (cb2: Function) => cb2(undefined, test(value))),
      (err, tests) => {
        if (err) throw err

        if (tests) {
          async.parallel(
            <any>tests,
            (err, result) => {
              if (err) throw err

              if (result) errors = <string[]>result.compact()
            }
          )
        }
      }
    )

    if (errors.length == 0) return { errors: null, value }

    return {
      errors,
      value
    }
  }
}

export default TypeAny
