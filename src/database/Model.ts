import * as mongodb from 'mongodb'
import * as connect from './connect'
import * as Collection from './Collection'
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

  protected collection = this.constructor.name.toLowerCase() + 's'

  protected static schema: Model.SchemaDefinition = {}

  readonly hidden: Array<string> = []

  model: mongodb.Collection = this._connect()

  /**
   *
   */
  constructor(document?: Partial<Model.Schema>) {
    if (document) {
      // TODO
    }
  }

  private _connect(): mongodb.Collection {
    return __FOX__.db.connections[(this.constructor as any).connection].collection(this.collection)
  }

  static validate(document: Partial<Model.Schema>) {
    return types.validate(document, types.object().keys(this.schema))
  }

  static isInstance(arg: any) {
    return arg instanceof this
  }
}

applyStaticMixins(Model, [Collection])

export = Model
