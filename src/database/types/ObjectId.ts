import { ObjectId } from 'mongodb'
import TypeAny from './Any'

class TypeObjectId extends TypeAny {
  protected _base(v: any) {
    if (
      (String.isInstance(v) || Number.isInstance(v) || Function.isInstance(v)) &&
      ObjectId.isValid(v)
    ) return null

    return 'Must be an object id'
  }
}

export default TypeObjectId
