import TypeAny from './types/Any'

declare module Schema {
  export interface Definition {
    [key: string]: TypeAny | Definition
  }
}

class Schema {
  static validate(schema: Schema.Definition, doc: Object) {
    let value: OBJ = {}
    let errors: OBJ | null = {}

    for (let key in schema) {
      let type = schema[key]
      let item = (doc as OBJ)[key]

      if (type instanceof TypeAny) {
        // Type
        let validation = type.validate(item)

        if (validation.value) value[key] = validation.value

        if (validation.errors) errors[key] = validation.errors
      } else {
        // Object
        if (!item) item = {}

        let validation = this.validate(type, item)

        if (validation.errors)
          for (let errorKey in validation.errors)
            errors[`${key}.${errorKey}`] = validation.errors[errorKey]

        if (validation.value.size() > 0) value[key] = validation.value
      }
    }

    if (errors.size() == 0) errors = null

    return {
      errors,
      value
    }
  }
}

export = Schema
