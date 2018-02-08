import * as mongodb from 'mongodb'
import * as Collection from './Collection'
import * as connect from './connect'
import { applyMixins, applyStaticMixins } from '../utils'

declare interface Model extends Collection {
  [key: string]: any
}

declare module Model {
  export interface SchemaDefinition {
    [key: string]: any
  }

  export interface Schema {
    [key: string]: any
  }
}

/**
 *
 * @abstract
 */
abstract class Model implements Collection {
  protected abstract readonly connection: string

  protected collection = this.constructor.name.toLowerCase() + 's'

  protected abstract readonly schema: Model.SchemaDefinition

  readonly hidden: Array<string> = []

  model: mongodb.Collection = this._connect()

  /**
   *
   */
  constructor(document?: Model.Schema) {
    if (document) {
      // TODO
    }
  }

  private _connect(): mongodb.Collection {
    return __FOX__.db.connections[this.connection].collection(this.collection)
  }

  static isInstance(arg: any) {
    return arg instanceof this
  }
}

applyStaticMixins(Model, [Collection])

export = Model
