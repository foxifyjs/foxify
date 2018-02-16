import * as mongodb from 'mongodb'
import { EventEmitter } from 'events'
import * as Model from './Model'
import * as Cursor from './Cursor'

declare module Collection {
  export interface ClientSession extends EventEmitter {
    endSession(callback?: mongodb.MongoCallback<void>): void;
    endSession(options: any, callback?: mongodb.MongoCallback<void>): void;
    equals(session: ClientSession): boolean;
  }
}

declare interface Collection<TSchema = any> {
  aggregate(pipeline: Object[], callback: mongodb.MongoCallback<TSchema[]>): mongodb.AggregationCursor<TSchema>
  aggregate(pipeline: Object[], options?: mongodb.CollectionAggregationOptions, callback?: mongodb.MongoCallback<TSchema[]>): mongodb.AggregationCursor<TSchema>

  bulkWrite(operations: Object[], callback: mongodb.MongoCallback<mongodb.BulkWriteOpResultObject>): void
  bulkWrite(operations: Object[], options?: mongodb.CollectionBluckWriteOptions): Promise<mongodb.BulkWriteOpResultObject>
  bulkWrite(operations: Object[], options: mongodb.CollectionBluckWriteOptions, callback: mongodb.MongoCallback<mongodb.BulkWriteOpResultObject>): void

  count(query: Object, callback: mongodb.MongoCallback<number>): void
  count(query: Object, options?: mongodb.MongoCountPreferences): Promise<number>
  count(query: Object, options: mongodb.MongoCountPreferences, callback: mongodb.MongoCallback<number>): void

  createIndex(fieldOrSpec: string | any, callback: mongodb.MongoCallback<string>): void
  createIndex(fieldOrSpec: string | any, options?: mongodb.IndexOptions): Promise<string>
  createIndex(fieldOrSpec: string | any, options: mongodb.IndexOptions, callback: mongodb.MongoCallback<string>): void

  createIndexes(indexSpecs: Object[], callback: mongodb.MongoCallback<any>): void
  createIndexes(indexSpecs: Object[], options?: { session?: Collection.ClientSession }): Promise<any>
  createIndexes(indexSpecs: Object[], options: { session?: Collection.ClientSession }, callback: mongodb.MongoCallback<any>): void

  deleteMany(filter: Object, callback: mongodb.MongoCallback<mongodb.DeleteWriteOpResultObject>): void
  deleteMany(filter: Object, options?: mongodb.CommonOptions): Promise<mongodb.DeleteWriteOpResultObject>
  deleteMany(filter: Object, options: mongodb.CommonOptions, callback: mongodb.MongoCallback<mongodb.DeleteWriteOpResultObject>): void

  deleteOne(filter: Object, callback: mongodb.MongoCallback<mongodb.DeleteWriteOpResultObject>): void
  deleteOne(filter: Object, options?: mongodb.CommonOptions & { bypassDocumentValidation?: boolean }): Promise<mongodb.DeleteWriteOpResultObject>
  deleteOne(filter: Object, options: mongodb.CommonOptions & { bypassDocumentValidation?: boolean }, callback: mongodb.MongoCallback<mongodb.DeleteWriteOpResultObject>): void

  distinct(key: string, query: Object, callback: mongodb.MongoCallback<any>): void
  distinct(key: string, query: Object, options?: { readPreference?: mongodb.ReadPreference | string, maxTimeMS?: number, session?: Collection.ClientSession }): Promise<any>
  distinct(key: string, query: Object, options: { readPreference?: mongodb.ReadPreference | string, maxTimeMS?: number, session?: Collection.ClientSession }, callback: mongodb.MongoCallback<any>): void

  drop(options?: { session: Collection.ClientSession }): Promise<any>
  drop(callback: mongodb.MongoCallback<any>): void
  drop(options: { session: Collection.ClientSession }, callback: mongodb.MongoCallback<any>): void

  dropIndex(indexName: string, callback: mongodb.MongoCallback<any>): void
  dropIndex(indexName: string, options?: mongodb.CommonOptions & { maxTimeMS?: number }): Promise<any>
  dropIndex(indexName: string, options: mongodb.CommonOptions & { maxTimeMS?: number }, callback: mongodb.MongoCallback<any>): void

  dropIndexes(options?: { session?: Collection.ClientSession, maxTimeMS?: number }): Promise<any>;
  dropIndexes(callback?: mongodb.MongoCallback<any>): void;
  dropIndexes(options: { session?: Collection.ClientSession, maxTimeMS?: number }, callback: mongodb.MongoCallback<any>): void;

  find<T = TSchema>(query?: Object): Cursor<T>
  find<T = TSchema>(query: Object, options?: mongodb.FindOneOptions): Cursor<T>






  findOne(): Promise<TSchema | null>
  findOne(cb: mongodb.MongoCallback<TSchema | null>): void
  findOne(query: Object): Promise<TSchema | null>
  findOne(query: Object, cb: mongodb.MongoCallback<TSchema | null>): void
  findOne(query: Object, options: mongodb.FindOneOptions): Promise<TSchema | null>
  findOne(query: Object, options: mongodb.FindOneOptions, cb: mongodb.MongoCallback<TSchema | null>): void

  findOneAndDelete(filter: Object, callback: mongodb.MongoCallback<mongodb.FindAndModifyWriteOpResultObject<TSchema>>): void
  findOneAndDelete(filter: Object, options?: { projection?: Object, sort?: Object, maxTimeMS?: number, session?: Collection.ClientSession }): Promise<mongodb.FindAndModifyWriteOpResultObject<TSchema>>
  findOneAndDelete(filter: Object, options: { projection?: Object, sort?: Object, maxTimeMS?: number, session?: Collection.ClientSession }, callback: mongodb.MongoCallback<mongodb.FindAndModifyWriteOpResultObject<TSchema>>): void

  findOneAndReplace(filter: Object, replacement: Object, callback: mongodb.MongoCallback<mongodb.FindAndModifyWriteOpResultObject<TSchema>>): void;
  findOneAndReplace(filter: Object, replacement: Object, options?: mongodb.FindOneAndReplaceOption): Promise<mongodb.FindAndModifyWriteOpResultObject<TSchema>>;
  findOneAndReplace(filter: Object, replacement: Object, options: mongodb.FindOneAndReplaceOption, callback: mongodb.MongoCallback<mongodb.FindAndModifyWriteOpResultObject<TSchema>>): void;

  findOneAndUpdate(filter: Object, update: Object, callback: mongodb.MongoCallback<mongodb.FindAndModifyWriteOpResultObject<TSchema>>): void;
  findOneAndUpdate(filter: Object, update: Object, options?: mongodb.FindOneAndReplaceOption): Promise<mongodb.FindAndModifyWriteOpResultObject<TSchema>>;
  findOneAndUpdate(filter: Object, update: Object, options: mongodb.FindOneAndReplaceOption, callback: mongodb.MongoCallback<mongodb.FindAndModifyWriteOpResultObject<TSchema>>): void;

  geoHaystackSearch(x: number, y: number, callback: mongodb.MongoCallback<any>): void;
  geoHaystackSearch(x: number, y: number, options?: mongodb.GeoHaystackSearchOptions): Promise<any>;
  geoHaystackSearch(x: number, y: number, options: mongodb.GeoHaystackSearchOptions, callback: mongodb.MongoCallback<any>): void;
}

class Collection<TSchema = any> {
  aggregate(...args: Array<any>) {
    let collection = new (this as any)().model

    return collection.aggregate(...args)
  }

  bulkWrite(...args: Array<any>) {
    let collection = new (this as any)().model

    return collection.bulkWrite(...args)
  }

  count(...args: Array<any>) {
    let collection = new (this as any)().model
    return collection.count(...args)
  }

  createIndex(...args: Array<any>) {
    let collection = new (this as any)().model

    return collection.createIndex(...args)
  }

  createIndexes(...args: Array<any>) {
    let collection = new (this as any)().model

    return collection.createIndexes(...args)
  }

  deleteMany(...args: Array<any>) {
    let collection = new (this as any)().model

    return collection.deleteMany(...args)
  }

  deleteOne(...args: Array<any>) {
    let collection = new (this as any)().model

    return collection.deleteOne(...args)
  }

  distinct(...args: Array<any>) {
    let collection = new (this as any)().model

    return collection.distinct(...args)
  }

  drop(...args: Array<any>) {
    let collection = new (this as any)().model

    return collection.drop(...args)
  }

  dropIndex(...args: Array<any>) {
    let collection = new (this as any)().model

    return collection.dropIndex(...args)
  }

  dropIndexes(...args: Array<any>) {
    let collection = new (this as any)().model

    return collection.dropIndexes(...args)
  }

  find(...args: Array<any>): Cursor<TSchema> {
    let collection = new (this as any)().model

    let cursor = collection.find(...args)

    return new Cursor(cursor)
  }






  findOne(...args: Array<any>) {
    let collection = new (this as any)().model

    return collection.findOne(...args)
  }

  findOneAndDelete(...args: Array<any>) {
    let collection = new (this as any)().model

    return collection.findOneAndDelete(...args)
  }

  findOneAndReplace(...args: Array<any>) {
    let collection = new (this as any)().model

    return collection.findOneAndReplace(...args)
  }

  findOneAndUpdate(...args: Array<any>) {
    let collection = new (this as any)().model

    return collection.findOneAndUpdate(...args)
  }

  geoHaystackSearch(...args: Array<any>) {
    let collection = new (this as any)().model

    return collection.geoHaystackSearch(...args)
  }
}

export = Collection
