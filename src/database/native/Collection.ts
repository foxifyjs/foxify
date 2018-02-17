import * as mongodb from 'mongodb'
import { EventEmitter } from 'events'
import * as Model from '../Model'
import * as Cursor from './Cursor'

declare module Collection {
  export interface ClientSession extends EventEmitter {
    endSession(callback?: mongodb.MongoCallback<void>): void;
    endSession(options: any, callback?: mongodb.MongoCallback<void>): void;
    equals(session: ClientSession): boolean;
  }
}

declare interface Collection<TSchema = any> {
  _connect(): mongodb.Collection
  _validate(document: Partial<Model.Schema>): any

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

  findOne<T = TSchema>(filter: Object, callback: mongodb.MongoCallback<T | null>): void
  findOne<T = TSchema>(filter: Object, options?: mongodb.FindOneOptions): Promise<T | null>
  findOne<T = TSchema>(filter: Object, options: mongodb.FindOneOptions, callback: mongodb.MongoCallback<T | null>): void

  findOneAndDelete(filter: Object, callback: mongodb.MongoCallback<mongodb.FindAndModifyWriteOpResultObject<TSchema>>): void
  findOneAndDelete(filter: Object, options?: { projection?: Object, sort?: Object, maxTimeMS?: number, session?: Collection.ClientSession }): Promise<mongodb.FindAndModifyWriteOpResultObject<TSchema>>
  findOneAndDelete(filter: Object, options: { projection?: Object, sort?: Object, maxTimeMS?: number, session?: Collection.ClientSession }, callback: mongodb.MongoCallback<mongodb.FindAndModifyWriteOpResultObject<TSchema>>): void

  findOneAndReplace(filter: Object, replacement: Object, callback: mongodb.MongoCallback<mongodb.FindAndModifyWriteOpResultObject<TSchema>>): void
  findOneAndReplace(filter: Object, replacement: Object, options?: mongodb.FindOneAndReplaceOption): Promise<mongodb.FindAndModifyWriteOpResultObject<TSchema>>
  findOneAndReplace(filter: Object, replacement: Object, options: mongodb.FindOneAndReplaceOption, callback: mongodb.MongoCallback<mongodb.FindAndModifyWriteOpResultObject<TSchema>>): void

  findOneAndUpdate(filter: Object, update: Object, callback: mongodb.MongoCallback<mongodb.FindAndModifyWriteOpResultObject<TSchema>>): void
  findOneAndUpdate(filter: Object, update: Object, options?: mongodb.FindOneAndReplaceOption): Promise<mongodb.FindAndModifyWriteOpResultObject<TSchema>>
  findOneAndUpdate(filter: Object, update: Object, options: mongodb.FindOneAndReplaceOption, callback: mongodb.MongoCallback<mongodb.FindAndModifyWriteOpResultObject<TSchema>>): void

  geoHaystackSearch(x: number, y: number, callback: mongodb.MongoCallback<any>): void
  geoHaystackSearch(x: number, y: number, options?: mongodb.GeoHaystackSearchOptions): Promise<any>
  geoHaystackSearch(x: number, y: number, options: mongodb.GeoHaystackSearchOptions, callback: mongodb.MongoCallback<any>): void

  indexes(options?: { session: Collection.ClientSession }): Promise<any>
  indexes(callback: mongodb.MongoCallback<any>): void
  indexes(options: { session?: Collection.ClientSession }, callback: mongodb.MongoCallback<any>): void

  indexExists(indexes: string | string[], callback: mongodb.MongoCallback<boolean>): void
  indexExists(indexes: string | string[], options?: { session: Collection.ClientSession }): Promise<boolean>
  indexExists(indexes: string | string[], options: { session: Collection.ClientSession }, callback: mongodb.MongoCallback<boolean>): void

  indexInformation(callback: mongodb.MongoCallback<any>): void
  indexInformation(options?: { full: boolean, session: Collection.ClientSession }): Promise<any>
  indexInformation(options: { full: boolean, session: Collection.ClientSession }, callback: mongodb.MongoCallback<any>): void

  initializeOrderedBulkOp(options?: mongodb.CommonOptions): mongodb.OrderedBulkOperation

  initializeUnorderedBulkOp(options?: mongodb.CommonOptions): mongodb.UnorderedBulkOperation

  insertMany(docs: Object[], callback: mongodb.MongoCallback<mongodb.InsertWriteOpResult>): void
  insertMany(docs: Object[], options?: mongodb.CollectionInsertManyOptions): Promise<mongodb.InsertWriteOpResult>
  insertMany(docs: Object[], options: mongodb.CollectionInsertManyOptions, callback: mongodb.MongoCallback<mongodb.InsertWriteOpResult>): void

  insertOne(docs: Object, callback: mongodb.MongoCallback<mongodb.InsertOneWriteOpResult>): void
  insertOne(docs: Object, options?: mongodb.CollectionInsertOneOptions): Promise<mongodb.InsertOneWriteOpResult>
  insertOne(docs: Object, options: mongodb.CollectionInsertOneOptions, callback: mongodb.MongoCallback<mongodb.InsertOneWriteOpResult>): void

  isCapped(options?: { session: Collection.ClientSession }): Promise<any>
  isCapped(callback: mongodb.MongoCallback<any>): void
  isCapped(options: { session: Collection.ClientSession }, callback: mongodb.MongoCallback<any>): void

  listIndexes(options?: { batchSize?: number, readPreference?: mongodb.ReadPreference | string, session?: Collection.ClientSession }): mongodb.CommandCursor

  mapReduce(map: Function | string, reduce: Function | string, callback: mongodb.MongoCallback<any>): void
  mapReduce(map: Function | string, reduce: Function | string, options?: mongodb.MapReduceOptions): Promise<any>
  mapReduce(map: Function | string, reduce: Function | string, options: mongodb.MapReduceOptions, callback: mongodb.MongoCallback<any>): void

  options(options?: { session: Collection.ClientSession }): Promise<any>
  options(callback: mongodb.MongoCallback<any>): void
  options(options: { session: Collection.ClientSession }, callback: mongodb.MongoCallback<any>): void

  parallelCollectionScan(callback: mongodb.MongoCallback<Cursor<any>[]>): void
  parallelCollectionScan(options?: mongodb.ParallelCollectionScanOptions): Promise<Cursor<any>[]>
  parallelCollectionScan(options: mongodb.ParallelCollectionScanOptions, callback: mongodb.MongoCallback<Cursor<any>[]>): void

  reIndex(options?: { session: Collection.ClientSession }): Promise<any>
  reIndex(callback: mongodb.MongoCallback<any>): void
  reIndex(options: { session: Collection.ClientSession }, callback: mongodb.MongoCallback<any>): void

  replaceOne(filter: Object, doc: Object, callback: mongodb.MongoCallback<mongodb.ReplaceWriteOpResult>): void
  replaceOne(filter: Object, doc: Object, options?: mongodb.ReplaceOneOptions): Promise<mongodb.ReplaceWriteOpResult>
  replaceOne(filter: Object, doc: Object, options: mongodb.ReplaceOneOptions, callback: mongodb.MongoCallback<mongodb.ReplaceWriteOpResult>): void

  stats(callback: mongodb.MongoCallback<mongodb.CollStats>): void
  stats(options?: { scale: number, session?: Collection.ClientSession }): Promise<mongodb.CollStats>
  stats(options: { scale: number, session?: Collection.ClientSession }, callback: mongodb.MongoCallback<mongodb.CollStats>): void

  updateMany(filter: Object, update: Object, callback: mongodb.MongoCallback<mongodb.UpdateWriteOpResult>): void
  updateMany(filter: Object, update: Object, options?: mongodb.CommonOptions & { upsert?: boolean }): Promise<mongodb.UpdateWriteOpResult>
  updateMany(filter: Object, update: Object, options: mongodb.CommonOptions & { upsert?: boolean }, callback: mongodb.MongoCallback<mongodb.UpdateWriteOpResult>): void

  updateOne(filter: Object, update: Object, callback: mongodb.MongoCallback<mongodb.UpdateWriteOpResult>): void
  updateOne(filter: Object, update: Object, options?: mongodb.ReplaceOneOptions): Promise<mongodb.UpdateWriteOpResult>
  updateOne(filter: Object, update: Object, options: mongodb.ReplaceOneOptions, callback: mongodb.MongoCallback<mongodb.UpdateWriteOpResult>): void

  watch(pipeline?: Object[], options?: mongodb.ChangeStreamOptions & { session?: Collection.ClientSession }): mongodb.ChangeStream
}

class Collection<TSchema = any> {
  aggregate(...args: Array<any>) {
    let collection = this._connect()

    return collection.aggregate.apply(collection, args)
  }

  bulkWrite(...args: Array<any>) {
    let collection = this._connect()

    return collection.bulkWrite.apply(collection, args)
  }

  count(...args: Array<any>) {
    let collection = this._connect()

    return collection.count.apply(collection, args)
  }

  createIndex(...args: Array<any>) {
    let collection = this._connect()

    return collection.createIndex.apply(collection, args)
  }

  createIndexes(...args: Array<any>) {
    let collection = this._connect()

    return collection.createIndexes.apply(collection, args)
  }

  deleteMany(...args: Array<any>) {
    let collection = this._connect()

    return collection.deleteMany.apply(collection, args)
  }

  deleteOne(...args: Array<any>) {
    let collection = this._connect()

    return collection.deleteOne.apply(collection, args)
  }

  distinct(...args: Array<any>) {
    let collection = this._connect()

    return collection.distinct.apply(collection, args)
  }

  drop(...args: Array<any>) {
    let collection = this._connect()

    return collection.drop.apply(collection, args)
  }

  dropIndex(...args: Array<any>) {
    let collection = this._connect()

    return collection.dropIndex.apply(collection, args)
  }

  dropIndexes(...args: Array<any>) {
    let collection = this._connect()

    return collection.dropIndexes.apply(collection, args)
  }

  find(...args: Array<any>): Cursor<TSchema> {
    let collection = this._connect()

    let cursor = collection.find.apply(collection, args)

    return new Cursor(cursor)
  }

  findOne(...args: Array<any>) {
    let collection = this._connect()

    return collection.findOne.apply(collection, args)
  }

  findOneAndDelete(...args: Array<any>) {
    let collection = this._connect()

    return collection.findOneAndDelete.apply(collection, args)
  }

  findOneAndReplace(...args: Array<any>) {
    let collection = this._connect()

    return collection.findOneAndReplace.apply(collection, args)
  }

  findOneAndUpdate(...args: Array<any>) {
    let collection = this._connect()

    return collection.findOneAndUpdate.apply(collection, args)
  }

  geoHaystackSearch(...args: Array<any>) {
    let collection = this._connect()

    return collection.geoHaystackSearch.apply(collection, args)
  }

  indexes(...args: Array<any>) {
    let collection = this._connect()

    return collection.indexes.apply(collection, args)
  }

  indexExists(...args: Array<any>) {
    let collection = this._connect()

    return collection.indexExists.apply(collection, args)
  }

  indexInformation(...args: Array<any>) {
    let collection = this._connect()

    return collection.indexInformation.apply(collection, args)
  }

  initializeOrderedBulkOp(...args: Array<any>) {
    let collection = this._connect()

    return collection.initializeOrderedBulkOp.apply(collection, args)
  }

  initializeUnorderedBulkOp(...args: Array<any>) {
    let collection = this._connect()

    return collection.initializeUnorderedBulkOp.apply(collection, args)
  }

  insertMany(...args: Array<any>) {
    let collection = this._connect()

    return collection.insertMany.apply(collection, args)
  }

  insertOne(doc: Object,...rest: Array<any>) {
    doc = this._validate(doc)

    let collection = this._connect()

    return collection.insertOne.apply(collection, [doc, ...rest])
  }

  isCapped(...args: Array<any>) {
    let collection = this._connect()

    return collection.isCapped.apply(collection, [args])
  }

  listIndexes(...args: Array<any>) {
    let collection = this._connect()

    return collection.listIndexes.apply(collection, args)
  }

  mapReduce(...args: Array<any>) {
    let collection = this._connect()

    return collection.mapReduce.apply(collection, args)
  }

  options(...args: Array<any>) {
    let collection = this._connect()

    return collection.options.apply(collection, args)
  }

  parallelCollectionScan(...args: Array<any>) {
    let collection = this._connect()

    return collection.parallelCollectionScan.apply(collection, args)
  }

  reIndex(...args: Array<any>) {
    let collection = this._connect()

    return collection.reIndex.apply(collection, args)
  }

  // rename ?

  replaceOne(...args: Array<any>) {
    let collection = this._connect()

    return collection.replaceOne.apply(collection, args)
  }

  stats(...args: Array<any>) {
    let collection = this._connect()

    return collection.stats.apply(collection, args)
  }

  updateMany(...args: Array<any>) {
    let collection = this._connect()

    return collection.updateMany.apply(collection, args)
  }

  updateOne(...args: Array<any>) {
    let collection = this._connect()

    return collection.updateOne.apply(collection, args)
  }

  watch(...args: Array<any>) {
    let collection = this._connect()

    return collection.watch.apply(collection, args)
  }
}

export = Collection
