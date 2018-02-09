import * as mongodb from 'mongodb'
import * as connect from './connect'

declare module Model {
}

/**
 *
 * @abstract
 */
abstract class Model {
  protected abstract readonly connection: string

  protected collection = this.constructor.name.toLowerCase() + 's'

  model: mongodb.Collection = this._connect()

  /**
   *
   */
  constructor() {
    return <any>this.model
  }

  private _connect(): mongodb.Collection {
    return __FOX__.db.connections[this.connection].collection(this.collection)
  }
}

export = Model
