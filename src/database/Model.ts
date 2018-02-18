import * as mongodb from 'mongodb'
import * as connect from './connect'
import * as Collection from './native/Collection'
import * as Schema from './Schema'
import * as types from './types'
import { applyStaticMixins } from '../utils'

declare module Model {
  export interface SchemaDefinition {
    [key: string]: any
  }

  export interface Schema {
    [key: string]: any
  }
}

declare interface Model extends Collection {
}

/**
 *
 * @abstract
 */
abstract class Model implements Collection {
  static types = types

  protected static connection: string = 'default'

  protected static collection: string

  protected static get _collection() {
    return this.collection || this.name.toLowerCase() + 's'
  }

  protected static schema: Model.SchemaDefinition = {}

  readonly hidden: Array<string> = []

  model: mongodb.Collection = (this.constructor as any)._connect()

  /**
   *
   */
  constructor(document?: Partial<Model.Schema>) {
    if (document) {
      // TODO
    }
  }

  private static _connect(): mongodb.Collection {
    return __FOX__.db.connections[this.connection].collection(this._collection)
  }

  protected static _validate(document: Partial<Model.Schema>) {
    let validation = Schema.validate(this.schema, document)

    if (validation.errors) throw new HttpExeption(500, validation.errors)

    return validation.value
  }

  static isInstance(arg: any) {
    return arg instanceof this
  }
}

applyStaticMixins(Model, [Collection])

export = Model
