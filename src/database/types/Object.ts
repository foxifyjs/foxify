import { TypeAny } from './Any'

class TypeObject extends TypeAny {
  protected _base(value: any) {
    if (Object.isInstance(value)) return null

    return 'Must be a object'
  }
}

export { TypeObject }
export default new TypeObject
