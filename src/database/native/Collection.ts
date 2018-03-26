import * as mongodb from "mongodb";
import { EventEmitter } from "events";
import * as Model from "../Model";
import * as Cursor from "./Cursor";

declare module CollectionConstructor {
  export interface ClientSession extends EventEmitter {
    endSession(callback?: mongodb.MongoCallback<void>): void;
    endSession(options: any, callback?: mongodb.MongoCallback<void>): void;
    equals(session: ClientSession): boolean;
  }
}

declare interface CollectionConstructor {
  aggregate<TSchema = any>(
    pipeline: object[], callback: mongodb.MongoCallback<TSchema[]>,
  ): mongodb.AggregationCursor<TSchema>;
  aggregate<TSchema = any>(
    pipeline: object[], options?: mongodb.CollectionAggregationOptions, callback?: mongodb.MongoCallback<TSchema[]>,
  ): mongodb.AggregationCursor<TSchema>;

  bulkWrite(
    operations: object[], callback: mongodb.MongoCallback<mongodb.BulkWriteOpResultObject>,
  ): void;
  bulkWrite(
    operations: object[], options?: mongodb.CollectionBluckWriteOptions,
  ): Promise<mongodb.BulkWriteOpResultObject>;
  bulkWrite(
    operations: object[], options: mongodb.CollectionBluckWriteOptions,
    callback: mongodb.MongoCallback<mongodb.BulkWriteOpResultObject>,
  ): void;

  count(query: object, callback: mongodb.MongoCallback<number>): void;
  count(query: object, options?: mongodb.MongoCountPreferences): Promise<number>;
  count(query: object, options: mongodb.MongoCountPreferences, callback: mongodb.MongoCallback<number>): void;

  createIndex(fieldOrSpec: string | any, callback: mongodb.MongoCallback<string>): void;
  createIndex(fieldOrSpec: string | any, options?: mongodb.IndexOptions): Promise<string>;
  createIndex(
    fieldOrSpec: string | any, options: mongodb.IndexOptions, callback: mongodb.MongoCallback<string>,
  ): void;

  createIndexes(indexSpecs: object[], callback: mongodb.MongoCallback<any>): void;
  createIndexes(indexSpecs: object[], options?: { session?: CollectionConstructor.ClientSession }): Promise<any>;
  createIndexes(
    indexSpecs: object[], options: { session?: CollectionConstructor.ClientSession },
    callback: mongodb.MongoCallback<any>,
  ): void;

  deleteMany(filter: object, callback: mongodb.MongoCallback<mongodb.DeleteWriteOpResultObject>): void;
  deleteMany(filter: object, options?: mongodb.CommonOptions): Promise<mongodb.DeleteWriteOpResultObject>;
  deleteMany(
    filter: object, options: mongodb.CommonOptions, callback: mongodb.MongoCallback<mongodb.DeleteWriteOpResultObject>,
  ): void;

  deleteOne(filter: object, callback: mongodb.MongoCallback<mongodb.DeleteWriteOpResultObject>): void;
  deleteOne(
    filter: object, options?: mongodb.CommonOptions & { bypassDocumentValidation?: boolean },
  ): Promise<mongodb.DeleteWriteOpResultObject>;
  deleteOne(
    filter: object, options: mongodb.CommonOptions & { bypassDocumentValidation?: boolean },
    callback: mongodb.MongoCallback<mongodb.DeleteWriteOpResultObject>,
  ): void;

  distinct(key: string, query: object, callback: mongodb.MongoCallback<any>): void;
  distinct(
    key: string, query: object, options?: {
      readPreference?: mongodb.ReadPreference | string, maxTimeMS?: number,
      session?: CollectionConstructor.ClientSession,
    },
  ): Promise<any>;
  distinct(
    key: string, query: object, options: {
      readPreference?: mongodb.ReadPreference | string, maxTimeMS?: number,
      session?: CollectionConstructor.ClientSession,
    },
    callback: mongodb.MongoCallback<any>,
  ): void;

  drop(options?: { session: CollectionConstructor.ClientSession }): Promise<any>;
  drop(callback: mongodb.MongoCallback<any>): void;
  drop(options: { session: CollectionConstructor.ClientSession }, callback: mongodb.MongoCallback<any>): void;

  dropIndex(indexName: string, callback: mongodb.MongoCallback<any>): void;
  dropIndex(indexName: string, options?: mongodb.CommonOptions & { maxTimeMS?: number }): Promise<any>;
  dropIndex(
    indexName: string, options: mongodb.CommonOptions & { maxTimeMS?: number }, callback: mongodb.MongoCallback<any>,
  ): void;

  dropIndexes(options?: { session?: CollectionConstructor.ClientSession, maxTimeMS?: number }): Promise<any>;
  dropIndexes(callback?: mongodb.MongoCallback<any>): void;
  dropIndexes(
    options: { session?: CollectionConstructor.ClientSession, maxTimeMS?: number },
    callback: mongodb.MongoCallback<any>,
  ): void;

  find<T = any>(query?: object, options?: mongodb.FindOneOptions): Cursor<T>;

  findOne<T = any>(filter: object, callback: mongodb.MongoCallback<T | null>): void;
  findOne<T = any>(filter: object, options?: mongodb.FindOneOptions): Promise<T | null>;
  findOne<T = any>(
    filter: object, options: mongodb.FindOneOptions, callback: mongodb.MongoCallback<T | null>,
  ): void;

  findOneAndDelete<TSchema = any>(
    filter: object, callback: mongodb.MongoCallback<mongodb.FindAndModifyWriteOpResultObject<TSchema>>,
  ): void;
  findOneAndDelete<TSchema = any>(
    filter: object, options?: {
      projection?: object, sort?: object, maxTimeMS?: number, session?: CollectionConstructor.ClientSession,
    },
  ): Promise<mongodb.FindAndModifyWriteOpResultObject<TSchema>>;
  findOneAndDelete<TSchema = any>(
    filter: object, options: {
      projection?: object, sort?: object, maxTimeMS?: number, session?: CollectionConstructor.ClientSession,
    },
    callback: mongodb.MongoCallback<mongodb.FindAndModifyWriteOpResultObject<TSchema>>,
  ): void;

  findOneAndReplace<TSchema = any>(
    filter: object, replacement: object,
    callback: mongodb.MongoCallback<mongodb.FindAndModifyWriteOpResultObject<TSchema>>,
  ): void;
  findOneAndReplace<TSchema = any>(
    filter: object, replacement: object, options?: mongodb.FindOneAndReplaceOption,
  ): Promise<mongodb.FindAndModifyWriteOpResultObject<TSchema>>;
  findOneAndReplace<TSchema = any>(
    filter: object, replacement: object, options: mongodb.FindOneAndReplaceOption,
    callback: mongodb.MongoCallback<mongodb.FindAndModifyWriteOpResultObject<TSchema>>,
  ): void;

  findOneAndUpdate<TSchema = any>(
    filter: object, update: object, callback: mongodb.MongoCallback<mongodb.FindAndModifyWriteOpResultObject<TSchema>>,
  ): void;
  findOneAndUpdate<TSchema = any>(
    filter: object, update: object, options?: mongodb.FindOneAndReplaceOption,
  ): Promise<mongodb.FindAndModifyWriteOpResultObject<TSchema>>;
  findOneAndUpdate<TSchema = any>(
    filter: object, update: object, options: mongodb.FindOneAndReplaceOption,
    callback: mongodb.MongoCallback<mongodb.FindAndModifyWriteOpResultObject<TSchema>>,
  ): void;

  geoHaystackSearch(x: number, y: number, callback: mongodb.MongoCallback<any>): void;
  geoHaystackSearch(x: number, y: number, options?: mongodb.GeoHaystackSearchOptions): Promise<any>;
  geoHaystackSearch(
    x: number, y: number, options: mongodb.GeoHaystackSearchOptions, callback: mongodb.MongoCallback<any>,
  ): void;

  indexes(options?: { session: CollectionConstructor.ClientSession }): Promise<any>;
  indexes(callback: mongodb.MongoCallback<any>): void;
  indexes(options: { session?: CollectionConstructor.ClientSession }, callback: mongodb.MongoCallback<any>): void;

  indexExists(indexes: string | string[], callback: mongodb.MongoCallback<boolean>): void;
  indexExists(indexes: string | string[], options?: { session: CollectionConstructor.ClientSession }): Promise<boolean>;
  indexExists(
    indexes: string | string[], options: { session: CollectionConstructor.ClientSession },
    callback: mongodb.MongoCallback<boolean>,
  ): void;

  indexInformation(callback: mongodb.MongoCallback<any>): void;
  indexInformation(options?: { full: boolean, session: CollectionConstructor.ClientSession }): Promise<any>;
  indexInformation(
    options: { full: boolean, session: CollectionConstructor.ClientSession }, callback: mongodb.MongoCallback<any>,
  ): void;

  initializeOrderedBulkOp(options?: mongodb.CommonOptions): mongodb.OrderedBulkOperation;

  initializeUnorderedBulkOp(options?: mongodb.CommonOptions): mongodb.UnorderedBulkOperation;

  insertMany(docs: object[], callback: mongodb.MongoCallback<mongodb.InsertWriteOpResult>): void;
  insertMany(
    docs: object[], options?: mongodb.CollectionInsertManyOptions,
  ): Promise<mongodb.InsertWriteOpResult>;
  insertMany(
    docs: object[], options: mongodb.CollectionInsertManyOptions,
    callback: mongodb.MongoCallback<mongodb.InsertWriteOpResult>,
  ): void;

  insertOne(doc: object, callback: mongodb.MongoCallback<mongodb.InsertOneWriteOpResult>): void;
  insertOne(doc: object, options?: mongodb.CollectionInsertOneOptions): Promise<mongodb.InsertOneWriteOpResult>;
  insertOne(
    doc: object, options: mongodb.CollectionInsertOneOptions,
    callback: mongodb.MongoCallback<mongodb.InsertOneWriteOpResult>,
  ): void;

  isCapped(options?: { session: CollectionConstructor.ClientSession }): Promise<any>;
  isCapped(callback: mongodb.MongoCallback<any>): void;
  isCapped(options: { session: CollectionConstructor.ClientSession }, callback: mongodb.MongoCallback<any>): void;

  listIndexes(
    options?: {
      batchSize?: number, readPreference?: mongodb.ReadPreference | string,
      session?: CollectionConstructor.ClientSession,
    },
  ): mongodb.CommandCursor;

  mapReduce(map: () => void | string, reduce: () => void | string, callback: mongodb.MongoCallback<any>): void;
  mapReduce(
    map: () => void | string, reduce: () => void | string, options?: mongodb.MapReduceOptions,
  ): Promise<any>;
  mapReduce(
    map: (() => void) | string, reduce: (() => void) | string, options: mongodb.MapReduceOptions,
    callback: mongodb.MongoCallback<any>,
  ): void;

  options(options?: { session: CollectionConstructor.ClientSession }): Promise<any>;
  options(callback: mongodb.MongoCallback<any>): void;
  options(options: { session: CollectionConstructor.ClientSession }, callback: mongodb.MongoCallback<any>): void;

  parallelCollectionScan(callback: mongodb.MongoCallback<Array<Cursor<any>>>): void;
  parallelCollectionScan(options?: mongodb.ParallelCollectionScanOptions): Promise<Array<Cursor<any>>>;
  parallelCollectionScan(
    options: mongodb.ParallelCollectionScanOptions, callback: mongodb.MongoCallback<Array<Cursor<any>>>,
  ): void;

  reIndex(options?: { session: CollectionConstructor.ClientSession }): Promise<any>;
  reIndex(callback: mongodb.MongoCallback<any>): void;
  reIndex(options: { session: CollectionConstructor.ClientSession }, callback: mongodb.MongoCallback<any>): void;

  replaceOne(filter: object, doc: object, callback: mongodb.MongoCallback<mongodb.ReplaceWriteOpResult>): void;
  replaceOne(
    filter: object, doc: object, options?: mongodb.ReplaceOneOptions,
  ): Promise<mongodb.ReplaceWriteOpResult>;
  replaceOne(
    filter: object, doc: object, options: mongodb.ReplaceOneOptions,
    callback: mongodb.MongoCallback<mongodb.ReplaceWriteOpResult>,
  ): void;

  stats(callback: mongodb.MongoCallback<mongodb.CollStats>): void;
  stats(options?: { scale: number, session?: CollectionConstructor.ClientSession }): Promise<mongodb.CollStats>;
  stats(
    options: { scale: number, session?: CollectionConstructor.ClientSession },
    callback: mongodb.MongoCallback<mongodb.CollStats>,
  ): void;

  updateMany(filter: object, update: object, callback: mongodb.MongoCallback<mongodb.UpdateWriteOpResult>): void;
  updateMany(
    filter: object, update: object, options?: mongodb.CommonOptions & { upsert?: boolean },
  ): Promise<mongodb.UpdateWriteOpResult>;
  updateMany(
    filter: object, update: object, options: mongodb.CommonOptions & { upsert?: boolean },
    callback: mongodb.MongoCallback<mongodb.UpdateWriteOpResult>,
  ): void;

  updateOne(filter: object, update: object, callback: mongodb.MongoCallback<mongodb.UpdateWriteOpResult>): void;
  updateOne(
    filter: object, update: object, options?: mongodb.ReplaceOneOptions,
  ): Promise<mongodb.UpdateWriteOpResult>;
  updateOne(
    filter: object, update: object, options: mongodb.ReplaceOneOptions,
    callback: mongodb.MongoCallback<mongodb.UpdateWriteOpResult>,
  ): void;

  watch(
    pipeline?: object[], options?: mongodb.ChangeStreamOptions & { session?: CollectionConstructor.ClientSession },
  ): mongodb.ChangeStream;
}

export class Collection {
  // @ts-ignore
  private static _connect(): mongodb.Collection;
  // @ts-ignore
  private static _validate(document: Partial<Model.Schema>, required?: boolean): any;

  // @ts-ignore
  static aggregate(...args: any[]) {
    const collection = this._connect();

    return collection.aggregate.apply(collection, args);
  }

  static bulkWrite(operations: object[], ...rest: any[]) {
    operations = (operations as Array<{ [key: string]: any }>).map((operation) => {
      if (operation.insertOne)
        operation.insertOne.document = this._validate(operation.insertOne.document, false);

      if (operation.updateOne)
        operation.updateOne.update.$set = this._validate(operation.updateOne.update.$set, false);

      if (operation.updateMany)
        operation.updateMany.update.$set = this._validate(operation.updateMany.update.$set, false);

      if (operation.replaceOne)
        operation.replaceOne.replacement = this._validate(operation.replaceOne.replacement, false);

      return operation;
    });

    const collection = this._connect();

    return collection.bulkWrite.apply(collection, [operations, ...rest]);
  }

  static count(...args: any[]) {
    const collection = this._connect();

    return collection.count.apply(collection, args);
  }

  static createIndex(...args: any[]) {
    const collection = this._connect();

    return collection.createIndex.apply(collection, args);
  }

  static createIndexes(...args: any[]) {
    const collection = this._connect();

    return collection.createIndexes.apply(collection, args);
  }

  static deleteMany(...args: any[]) {
    const collection = this._connect();

    return collection.deleteMany.apply(collection, args);
  }

  static deleteOne(...args: any[]) {
    const collection = this._connect();

    return collection.deleteOne.apply(collection, args);
  }

  static distinct(...args: any[]) {
    const collection = this._connect();

    return collection.distinct.apply(collection, args);
  }

  static drop(...args: any[]) {
    const collection = this._connect();

    return collection.drop.apply(collection, args);
  }

  static dropIndex(...args: any[]) {
    const collection = this._connect();

    return collection.dropIndex.apply(collection, args);
  }

  static dropIndexes(...args: any[]) {
    const collection = this._connect();

    return collection.dropIndexes.apply(collection, args);
  }

  static find(...args: any[]): Cursor<any> {
    const collection = this._connect();

    const cursor = collection.find.apply(collection, args);

    return new Cursor(cursor);
  }

  static findOne(...args: any[]) {
    const collection = this._connect();

    return collection.findOne.apply(collection, args);
  }

  static findOneAndDelete(...args: any[]) {
    const collection = this._connect();

    return collection.findOneAndDelete.apply(collection, args);
  }

  static findOneAndReplace(filter: object, replacement: object, ...rest: any[]) {
    replacement = this._validate(replacement, false);

    const collection = this._connect();

    return collection.findOneAndReplace.apply(collection, [filter, replacement, ...rest]);
  }

  static findOneAndUpdate(filter: object, update: object, ...rest: any[]) {
    (update as { [key: string]: any }).$set = this._validate((update as { [key: string]: any }).$set, false);

    const collection = this._connect();

    return collection.findOneAndUpdate.apply(collection, [filter, update, ...rest]);
  }

  static geoHaystackSearch(...args: any[]) {
    const collection = this._connect();

    return collection.geoHaystackSearch.apply(collection, args);
  }

  static indexes(...args: any[]) {
    const collection = this._connect();

    return collection.indexes.apply(collection, args);
  }

  static indexExists(...args: any[]) {
    const collection = this._connect();

    return collection.indexExists.apply(collection, args);
  }

  static indexInformation(...args: any[]) {
    const collection = this._connect();

    return collection.indexInformation.apply(collection, args);
  }

  static initializeOrderedBulkOp(...args: any[]) {
    const collection = this._connect();

    return collection.initializeOrderedBulkOp.apply(collection, args);
  }

  static initializeUnorderedBulkOp(...args: any[]) {
    const collection = this._connect();

    return collection.initializeUnorderedBulkOp.apply(collection, args);
  }

  static insertMany(docs: object[], ...rest: any[]) {
    docs = docs.map((doc) => this._validate(doc));

    const collection = this._connect();

    return collection.insertMany.apply(collection, [docs, ...rest]);
  }

  static insertOne(doc: object, ...rest: any[]) {
    doc = this._validate(doc);

    const collection = this._connect();

    return collection.insertOne.apply(collection, [doc, ...rest]);
  }

  static isCapped(...args: any[]) {
    const collection = this._connect();

    return collection.isCapped.apply(collection, [args]);
  }

  static listIndexes(...args: any[]) {
    const collection = this._connect();

    return collection.listIndexes.apply(collection, args);
  }

  static mapReduce(...args: any[]) {
    const collection = this._connect();

    return collection.mapReduce.apply(collection, args);
  }

  static options(...args: any[]) {
    const collection = this._connect();

    return collection.options.apply(collection, args);
  }

  static parallelCollectionScan(...args: any[]) {
    const collection = this._connect();

    return collection.parallelCollectionScan.apply(collection, args);
  }

  static reIndex(...args: any[]) {
    const collection = this._connect();

    return collection.reIndex.apply(collection, args);
  }

  // rename ?

  static replaceOne(filter: object, doc: object, ...rest: any[]) {
    doc = this._validate(doc, false);

    const collection = this._connect();

    return collection.replaceOne.apply(collection, [filter, doc, ...rest]);
  }

  static stats(...args: any[]) {
    const collection = this._connect();

    return collection.stats.apply(collection, args);
  }

  static updateMany(filter: object, update: object, ...rest: any[]) {
    (update as { [key: string]: any }).$set = this._validate((update as { [key: string]: any }).$set, false);

    const collection = this._connect();

    return collection.updateMany.apply(collection, [filter, update, ...rest]);
  }

  static updateOne(filter: object, update: object, ...rest: any[]) {
    (update as { [key: string]: any }).$set = this._validate((update as { [key: string]: any }).$set, false);

    const collection = this._connect();

    return collection.updateOne.apply(collection, [filter, update, ...rest]);
  }

  static watch(...args: any[]) {
    const collection = this._connect();

    return collection.watch.apply(collection, args);
  }
}

const CollectionConstructor: CollectionConstructor = Collection as any;

export default CollectionConstructor;

/**
 * FIXME I know this seems ugly but in my defense,
 * `Typescript` doesn't support static method inside interfaces
 */
module.exports = exports.default;
module.exports.default = exports.default;
