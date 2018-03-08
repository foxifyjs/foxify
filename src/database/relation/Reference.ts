import * as Model from '../Model'
import { Collection } from 'mongodb'

declare module Reference { }

class Reference {
  protected _model: typeof Model
  protected _localKey: string
  protected _foreignKey: string
  protected _relation?: string | typeof Model

  constructor(model: typeof Model, localKey?: string, foreignKey: string = 'id', relation?: string | typeof Model) {
    this._model = model

    this._localKey = localKey || `${model.toString().slice(0, -1)}_id`

    this._foreignKey = foreignKey || 'id'

    this._relation = relation
  }

  get model() {
    return this._model
  }

  get localKey() {
    return this._localKey
  }

  get foreignKey() {
    return this._foreignKey
  }

  get relation(): typeof Model | Collection<any> | undefined {
    if (!String.isInstance(this._relation)) return this._relation

    let data = (this._relation as string).split('.')

    let connection = 'default'
    let collection = data.first()

    if (data.length == 2) {
      connection = data.first()
      collection = data.last()
    }

    return __FOX__.db.connections[connection].collection(collection)
  }
}

export = Reference
