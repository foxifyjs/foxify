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

  protected static schema: Model.SchemaDefinition = {}

  protected static hidden: Array<string> = []

  // constructor(document?: Partial<Model.Schema>) {
  //   if (document) {
  //     // TODO
  //   }
  // }

  private static get _collection() {
    return this.collection || `${this.name.snakeCase()}s`
  }

  private static _connect(): mongodb.Collection {
    return __FOX__.db.connections[this.connection].collection(this._collection)
  }

  protected static _validate(document: Partial<Model.Schema>) {
    let validation = Schema.validate(this.schema, document)

    if (validation.errors) throw new HttpExeption(500, validation.errors)

    return validation.value
  }
}

applyStaticMixins(Model, [Collection])

export = Model
