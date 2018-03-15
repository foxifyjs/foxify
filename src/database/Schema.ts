import TypeAny from "./types/Any";

declare module Schema {
  export interface Definition {
    [key: string]: TypeAny | Definition;
  }
}

class Schema {
  static validate(schema: Schema.Definition, doc: object) {
    const value: OBJ = {};
    let errors: OBJ | null = {};

    for (const key in schema) {
      const type = schema[key];
      let item = (doc as OBJ)[key];

      if (type instanceof TypeAny) {
        // Type
        const validation = type.validate(item);

        if (validation.value) value[key] = validation.value;

        if (validation.errors) errors[key] = validation.errors;
      } else {
        // Object
        if (!item) item = {};

        const validation = this.validate(type, item);

        if (validation.errors)
          for (const errorKey in validation.errors)
            errors[`${key}.${errorKey}`] = validation.errors[errorKey];

        if (validation.value.size() > 0) value[key] = validation.value;
      }
    }

    if (errors.size() === 0) errors = null;

    return {
      errors,
      value,
    };
  }
}

export = Schema;
