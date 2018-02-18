import TypeAny from './Any'

class TypeBoolean extends TypeAny {
  protected _base(v: any) {
    if (Boolean.isInstance(v)) return null

    return 'Must be a boolean'
  }
}

export default TypeBoolean
