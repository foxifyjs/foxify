import * as mongodb from 'mongodb'
import * as deasync from 'deasync'
import Model from './Model'
import Cursor from './Cursor'

declare interface Collection<TSchema = any> {
  findOne<T = TSchema>(): T
  findOne<T = TSchema>(cb: mongodb.MongoCallback<T | null>): void
  findOne<T = TSchema>(query: Object): T
  findOne<T = TSchema>(query: Object, cb: mongodb.MongoCallback<T | null>): void
  findOne<T = TSchema>(query: Object, options: mongodb.FindOneOptions): T
  findOne<T = TSchema>(query: Object, options: mongodb.FindOneOptions, cb: mongodb.MongoCallback<T | null>): void
}

class Collection {
  find(query?: Object, options?: mongodb.FindOneOptions) {
    let collection = <mongodb.Collection>new (this as any)().model

    let cursor
    if (!query) cursor = collection.find()
    else cursor = collection.find(query, options)

    return new Cursor(cursor)
  }

  findOne<T>(query?: Object | mongodb.MongoCallback<T | null>,
    options?: mongodb.FindOneOptions | mongodb.MongoCallback<T | null>,
    callback?: mongodb.MongoCallback<T | null>) {
    let collection = <mongodb.Collection>new (this as any)().model

    if (Function.isInstance(query)) {
      callback = <mongodb.MongoCallback<T | null>>query
      query = {}
      options = {}
    }

    if (Function.isInstance(options)) {
      callback = <mongodb.MongoCallback<T | null>>options
      options = {}
    }

    if (callback) {
      return collection.findOne(<Object>query, <mongodb.FindOneOptions>options,
        (err, doc) => (callback as mongodb.MongoCallback<T | null>)(err, doc))
    }

    let item

    collection.findOne(<Object>query, <mongodb.FindOneOptions>options,
      (err, doc) => {
        if (err) throw err

        item = doc
      })

    while (item == undefined) deasync.sleep(1)

    return item
  }
}

export default Collection
