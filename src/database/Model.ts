import * as mongodb from 'mongodb'
import * as deasync from 'deasync'
import Exceptions from './Exceptions'
import Collection from './Collection'
import Cursor from './Cursor'
import connect from './connect'
import { applyMixins, applyStaticMixins } from '../utils'

declare interface Model extends Collection {
  [key: string]: any
  // Collection
  // find(...args: Array<any>): this
  // findOne(...args: Array<any>): never
}

declare namespace Model {
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
  protected static onnection: string | connect.Connection = {
    database: <string>process.env.DATABASE_NAME,
    user: <string>process.env.DATABASE_USER,
    password: <string>process.env.DATABASE_PASSWORD,
    host: <string>process.env.DATABASE_HOST,
    port: <string>process.env.DATABASE_PORT
  }

  protected collection = this.constructor.name.toLowerCase() + 's'

  protected abstract readonly schema: Model.SchemaDefinition
  readonly hidden: Array<string> = []

  model: mongodb.Collection = this._connect()

  /**
   *
   */
  constructor(document?: Model.Schema) {
    if (document) {
      ((this.constructor as any).schema as Model.Schema).map((type, key) => {
        let value = document[key]

        if (!type.isInstance(value)) throw new Error(`${Exceptions.INVALID_TYPE} - ${key} => ${value}`)

        this[key] = value
      })
    }
  }

  private _connect(): mongodb.Collection {
    if (String.isInstance((this.constructor as any).connection))
      return __FOX__.db.connections[(this.constructor as any).connection].collection(this.collection)

    return connect((this.constructor as any).connection).collection(this.collection)
  }

  static isInstance(arg: any) {
    return arg instanceof this
  }

  save() {
    let document: Model.Schema = {};

    (this.constructor as any).schema.map((type: any, key: string) => {
      let value = this[key]

      if (!type.isInstance(value)) throw new Error(`${Exceptions.INVALID_TYPE} - ${key} => ${value}`)

      document[key] = value
    })

    let saved: mongodb.InsertOneWriteOpResult | undefined

    this.model.insertOne(document)
      .then((doc) => saved = doc)
      .catch((err) => {
        throw err
      })

    while (saved === undefined) deasync.sleep(1);

    saved.ops.first().map((value: any, key: string) => saved[key] = value)

    return saved
  }
}

applyStaticMixins(Model, [Collection])

// applyMixins(Model, [Cursor])

export default Model
