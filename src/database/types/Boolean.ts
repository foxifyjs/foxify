import { TypeAny } from './Any'

class TypeBoolean extends TypeAny {
  protected _base(value: any) {
    if (Boolean.isInstance(value)) return null

    return 'Must be a boolean'
  }
}

export { TypeBoolean }
export default new TypeBoolean
