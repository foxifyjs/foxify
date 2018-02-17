import { TypeAny } from './types/Any'

declare module Schema {
  export interface Definition {
    [key: string]: TypeAny | Definition
  }
}

class Schema {
  validate(schema: Schema.Definition, doc: Object) {
    let value: OBJ = {}
    let errors: OBJ = {}

    for (let key in doc) {
      let item = (doc as OBJ)[key]

      if (item instanceof TypeAny) {
        // Type
        errors[key] = schema[key].errors(item)
      } else {
        // Object
        this.validate(schema[key], item)
      }
    }
  }
}

export = Schema
