import * as mongodb from "mongodb";
import { EventEmitter } from "events";
import * as Model from "../Model";
import * as Cursor from "./Cursor";

declare module Collection {
  export interface ClientSession extends EventEmitter {
    endSession(callback?: mongodb.MongoCallback<void>): void;
    endSession(options: any, callback?: mongodb.MongoCallback<void>): void;
    equals(session: ClientSession): boolean;
  }
}

declare interface Collection<TSchema = any> {
  _connect(): mongodb.Collection;
  _validate(document: Partial<Model.Schema>, required?: boolean): any;

  aggregate(pipeline: object[], callback: mongodb.MongoCallback<TSchema[]>): mongodb.AggregationCursor<TSchema>;
  aggregate(
    pipeline: object[],
    options?: mongodb.CollectionAggregationOptions,
    callback?: mongodb.MongoCallback<TSchema[]>,
  ): mongodb.AggregationCursor<TSchema>;

  bulkWrite(operations: object[], callback: mongodb.MongoCallback<mongodb.BulkWriteOpResultObject>): void;
  bulkWrite(
    operations: object[],
    options?: mongodb.CollectionBluckWriteOptions,
  ): Promise<mongodb.BulkWriteOpResultObject>;
  bulkWrite(
    operations: object[],
    options: mongodb.CollectionBluckWriteOptions,
    callback: mongodb.MongoCallback<mongodb.BulkWriteOpResultObject>,
  ): void;

  count(query: object, callback: mongodb.MongoCallback<number>): void;
  count(query: object, options?: mongodb.MongoCountPreferences): Promise<number>;
  count(query: object, options: mongodb.MongoCountPreferences, callback: mongodb.MongoCallback<number>): void;

  createIndex(fieldOrSpec: string | any, callback: mongodb.MongoCallback<string>): void;
  createIndex(fieldOrSpec: string | any, options?: mongodb.IndexOptions): Promise<string>;
  createIndex(fieldOrSpec: string | any, options: mongodb.IndexOptions, callback: mongodb.MongoCallback<string>): void;

  createIndexes(indexSpecs: object[], callback: mongodb.MongoCallback<any>): void;
  createIndexes(indexSpecs: object[], options?: { session?: Collection.ClientSession }): Promise<any>;
  createIndexes(
    indexSpecs: object[],
    options: { session?: Collection.ClientSession },
    callback: mongodb.MongoCallback<any>,
  ): void;

  deleteMany(filter: object, callback: mongodb.MongoCallback<mongodb.DeleteWriteOpResultObject>): void;
  deleteMany(filter: object, options?: mongodb.CommonOptions): Promise<mongodb.DeleteWriteOpResultObject>;
  deleteMany(
    filter: object,
    options: mongodb.CommonOptions,
    callback: mongodb.MongoCallback<mongodb.DeleteWriteOpResultObject>,
  ): void;

  deleteOne(filter: object, callback: mongodb.MongoCallback<mongodb.DeleteWriteOpResultObject>): void;
  deleteOne(
    filter: object,
    options?: mongodb.CommonOptions & { bypassDocumentValidation?: boolean },
  ): Promise<mongodb.DeleteWriteOpResultObject>;
  deleteOne(
    filter: object,
    options: mongodb.CommonOptions & { bypassDocumentValidation?: boolean },
    callback: mongodb.MongoCallback<mongodb.DeleteWriteOpResultObject>,
  ): void;

  distinct(key: string, query: object, callback: mongodb.MongoCallback<any>): void;
  distinct(
    key: string,
    query: object,
    options?: {
      readPreference?: mongodb.ReadPreference | string, maxTimeMS?: number, session?: Collection.ClientSession,
    },
  ): Promise<any>;
  distinct(
    key: string,
    query: object,
    options: {
      readPreference?: mongodb.ReadPreference | string, maxTimeMS?: number, session?: Collection.ClientSession,
    },
    callback: mongodb.MongoCallback<any>,
  ): void;

  drop(options?: { session: Collection.ClientSession }): Promise<any>;
  drop(callback: mongodb.MongoCallback<any>): void;
  drop(options: { session: Collection.ClientSession }, callback: mongodb.MongoCallback<any>): void;

  dropIndex(indexName: string, callback: mongodb.MongoCallback<any>): void;
  dropIndex(indexName: string, options?: mongodb.CommonOptions & { maxTimeMS?: number }): Promise<any>;
  dropIndex(
    indexName: string,
    options: mongodb.CommonOptions & { maxTimeMS?: number },
    callback: mongodb.MongoCallback<any>,
  ): void;

  dropIndexes(options?: { session?: Collection.ClientSession, maxTimeMS?: number }): Promise<any>;
  dropIndexes(callback?: mongodb.MongoCallback<any>): void;
  dropIndexes(
    options: { session?: Collection.ClientSession, maxTimeMS?: number },
    callback: mongodb.MongoCallback<any>,
  ): void;

  find<T = TSchema>(query?: object, options?: mongodb.FindOneOptions): Cursor<T>;

  findOne<T = TSchema>(filter: object, callback: mongodb.MongoCallback<T | null>): void;
  findOne<T = TSchema>(filter: object, options?: mongodb.FindOneOptions): Promise<T | null>;
  findOne<T = TSchema>(
    filter: object,
    options: mongodb.FindOneOptions,
    callback: mongodb.MongoCallback<T | null>,
  ): void;

  findOneAndDelete(
    filter: object,
    callback: mongodb.MongoCallback<mongodb.FindAndModifyWriteOpResultObject<TSchema>>): void;
  findOneAndDelete(
    filter: object,
    options?: {
      projection?: object, sort?: object, maxTimeMS?: number, session?: Collection.ClientSession,
    }): Promise<mongodb.FindAndModifyWriteOpResultObject<TSchema>>;
  findOneAndDelete(
    filter: object,
    options: {
      projection?: object, sort?: object, maxTimeMS?: number, session?: Collection.ClientSession,
    },
    callback: mongodb.MongoCallback<mongodb.FindAndModifyWriteOpResultObject<TSchema>>,
  ): void;

  findOneAndReplace(
    filter: object,
    replacement: object,
    callback: mongodb.MongoCallback<mongodb.FindAndModifyWriteOpResultObject<TSchema>>,
  ): void;
  findOneAndReplace(
    filter: object,
    replacement: object,
    options?: mongodb.FindOneAndReplaceOption,
  ): Promise<mongodb.FindAndModifyWriteOpResultObject<TSchema>>;
  findOneAndReplace(
    filter: object,
    replacement: object,
    options: mongodb.FindOneAndReplaceOption,
    callback: mongodb.MongoCallback<mongodb.FindAndModifyWriteOpResultObject<TSchema>>,
  ): void;

  findOneAndUpdate(
    filter: object,
    update: object,
    callback: mongodb.MongoCallback<mongodb.FindAndModifyWriteOpResultObject<TSchema>>,
  ): void;
  findOneAndUpdate(
    filter: object,
    update: object,
    options?: mongodb.FindOneAndReplaceOption,
  ): Promise<mongodb.FindAndModifyWriteOpResultObject<TSchema>>;
  findOneAndUpdate(
    filter: object,
    update: object,
    options: mongodb.FindOneAndReplaceOption,
    callback: mongodb.MongoCallback<mongodb.FindAndModifyWriteOpResultObject<TSchema>>,
  ): void;

  geoHaystackSearch(x: number, y: number, callback: mongodb.MongoCallback<any>): void;
  geoHaystackSearch(x: number, y: number, options?: mongodb.GeoHaystackSearchOptions): Promise<any>;
  geoHaystackSearch(
    x: number,
    y: number,
    options: mongodb.GeoHaystackSearchOptions,
    callback: mongodb.MongoCallback<any>,
  ): void;

  indexes(options?: { session: Collection.ClientSession }): Promise<any>;
  indexes(callback: mongodb.MongoCallback<any>): void;
  indexes(options: { session?: Collection.ClientSession }, callback: mongodb.MongoCallback<any>): void;

  indexExists(indexes: string | string[], callback: mongodb.MongoCallback<boolean>): void;
  indexExists(indexes: string | string[], options?: { session: Collection.ClientSession }): Promise<boolean>;
  indexExists(
    indexes: string | string[],
    options: { session: Collection.ClientSession },
    callback: mongodb.MongoCallback<boolean>,
  ): void;

  indexInformation(callback: mongodb.MongoCallback<any>): void;
  indexInformation(options?: { full: boolean, session: Collection.ClientSession }): Promise<any>;
  indexInformation(
    options: { full: boolean, session: Collection.ClientSession },
    callback: mongodb.MongoCallback<any>,
  ): void;

  initializeOrderedBulkOp(options?: mongodb.CommonOptions): mongodb.OrderedBulkOperation;

  initializeUnorderedBulkOp(options?: mongodb.CommonOptions): mongodb.UnorderedBulkOperation;

  insertMany(docs: object[], callback: mongodb.MongoCallback<mongodb.InsertWriteOpResult>): void;
  insertMany(docs: object[], options?: mongodb.CollectionInsertManyOptions): Promise<mongodb.InsertWriteOpResult>;
  insertMany(
    docs: object[],
    options: mongodb.CollectionInsertManyOptions,
    callback: mongodb.MongoCallback<mongodb.InsertWriteOpResult>,
  ): void;

  insertOne(docs: object, callback: mongodb.MongoCallback<mongodb.InsertOneWriteOpResult>): void;
  insertOne(docs: object, options?: mongodb.CollectionInsertOneOptions): Promise<mongodb.InsertOneWriteOpResult>;
  insertOne(
    docs: object,
    options: mongodb.CollectionInsertOneOptions,
    callback: mongodb.MongoCallback<mongodb.InsertOneWriteOpResult>,
  ): void;

  isCapped(options?: { session: Collection.ClientSession }): Promise<any>;
  isCapped(callback: mongodb.MongoCallback<any>): void;
  isCapped(options: { session: Collection.ClientSession }, callback: mongodb.MongoCallback<any>): void;

  listIndexes(
    options?: {
      batchSize?: number, readPreference?: mongodb.ReadPreference | string, session?: Collection.ClientSession,
    },
  ): mongodb.CommandCursor;

  mapReduce(map: () => void | string, reduce: () => void | string, callback: mongodb.MongoCallback<any>): void;
  mapReduce(map: () => void | string, reduce: () => void | string, options?: mongodb.MapReduceOptions): Promise<any>;
  mapReduce(
    map: (() => void) | string,
    reduce: (() => void) | string,
    options: mongodb.MapReduceOptions,
    callback: mongodb.MongoCallback<any>,
  ): void;

  options(options?: { session: Collection.ClientSession }): Promise<any>;
  options(callback: mongodb.MongoCallback<any>): void;
  options(options: { session: Collection.ClientSession }, callback: mongodb.MongoCallback<any>): void;

  parallelCollectionScan(callback: mongodb.MongoCallback<Array<Cursor<any>>>): void;
  parallelCollectionScan(options?: mongodb.ParallelCollectionScanOptions): Promise<Array<Cursor<any>>>;
  parallelCollectionScan(
    options: mongodb.ParallelCollectionScanOptions,
    callback: mongodb.MongoCallback<Array<Cursor<any>>>,
  ): void;

  reIndex(options?: { session: Collection.ClientSession }): Promise<any>;
  reIndex(callback: mongodb.MongoCallback<any>): void;
  reIndex(options: { session: Collection.ClientSession }, callback: mongodb.MongoCallback<any>): void;

  replaceOne(filter: object, doc: object, callback: mongodb.MongoCallback<mongodb.ReplaceWriteOpResult>): void;
  replaceOne(filter: object, doc: object, options?: mongodb.ReplaceOneOptions): Promise<mongodb.ReplaceWriteOpResult>;
  replaceOne(
    filter: object,
    doc: object,
    options: mongodb.ReplaceOneOptions,
    callback: mongodb.MongoCallback<mongodb.ReplaceWriteOpResult>,
  ): void;

  stats(callback: mongodb.MongoCallback<mongodb.CollStats>): void;
  stats(options?: { scale: number, session?: Collection.ClientSession }): Promise<mongodb.CollStats>;
  stats(
    options: { scale: number, session?: Collection.ClientSession },
    callback: mongodb.MongoCallback<mongodb.CollStats>,
  ): void;

  updateMany(filter: object, update: object, callback: mongodb.MongoCallback<mongodb.UpdateWriteOpResult>): void;
  updateMany(
    filter: object,
    update: object,
    options?: mongodb.CommonOptions & { upsert?: boolean },
  ): Promise<mongodb.UpdateWriteOpResult>;
  updateMany(
    filter: object,
    update: object,
    options: mongodb.CommonOptions & { upsert?: boolean },
    callback: mongodb.MongoCallback<mongodb.UpdateWriteOpResult>,
  ): void;

  updateOne(filter: object, update: object, callback: mongodb.MongoCallback<mongodb.UpdateWriteOpResult>): void;
  updateOne(filter: object, update: object, options?: mongodb.ReplaceOneOptions): Promise<mongodb.UpdateWriteOpResult>;
  updateOne(
    filter: object,
    update: object,
    options: mongodb.ReplaceOneOptions,
    callback: mongodb.MongoCallback<mongodb.UpdateWriteOpResult>,
  ): void;

  watch(pipeline?: object[], options?: mongodb.ChangeStreamOptions & { session?: Collection.ClientSession }):
    mongodb.ChangeStream;
}

class Collection<TSchema = any> {
  aggregate(...args: any[]) {
    const collection = this._connect();

    return collection.aggregate.apply(collection, args);
  }

  bulkWrite(operations: OBJ[], ...rest: any[]) {
    operations = operations.map((operation) => {
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

  count(...args: any[]) {
    const collection = this._connect();

    return collection.count.apply(collection, args);
  }

  createIndex(...args: any[]) {
    const collection = this._connect();

    return collection.createIndex.apply(collection, args);
  }

  createIndexes(...args: any[]) {
    const collection = this._connect();

    return collection.createIndexes.apply(collection, args);
  }

  deleteMany(...args: any[]) {
    const collection = this._connect();

    return collection.deleteMany.apply(collection, args);
  }

  deleteOne(...args: any[]) {
    const collection = this._connect();

    return collection.deleteOne.apply(collection, args);
  }

  distinct(...args: any[]) {
    const collection = this._connect();

    return collection.distinct.apply(collection, args);
  }

  drop(...args: any[]) {
    const collection = this._connect();

    return collection.drop.apply(collection, args);
  }

  dropIndex(...args: any[]) {
    const collection = this._connect();

    return collection.dropIndex.apply(collection, args);
  }

  dropIndexes(...args: any[]) {
    const collection = this._connect();

    return collection.dropIndexes.apply(collection, args);
  }

  find(...args: any[]): Cursor<TSchema> {
    const collection = this._connect();

    const cursor = collection.find.apply(collection, args);

    return new Cursor(cursor);
  }

  findOne(...args: any[]) {
    const collection = this._connect();

    return collection.findOne.apply(collection, args);
  }

  findOneAndDelete(...args: any[]) {
    const collection = this._connect();

    return collection.findOneAndDelete.apply(collection, args);
  }

  findOneAndReplace(filter: object, replacement: object, ...rest: any[]) {
    replacement = this._validate(replacement, false);

    const collection = this._connect();

    return collection.findOneAndReplace.apply(collection, [filter, replacement, ...rest]);
  }

  findOneAndUpdate(filter: object, update: OBJ, ...rest: any[]) {
    update.$set = this._validate(update.$set, false);

    const collection = this._connect();

    return collection.findOneAndUpdate.apply(collection, [filter, update, ...rest]);
  }

  geoHaystackSearch(...args: any[]) {
    const collection = this._connect();

    return collection.geoHaystackSearch.apply(collection, args);
  }

  indexes(...args: any[]) {
    const collection = this._connect();

    return collection.indexes.apply(collection, args);
  }

  indexExists(...args: any[]) {
    const collection = this._connect();

    return collection.indexExists.apply(collection, args);
  }

  indexInformation(...args: any[]) {
    const collection = this._connect();

    return collection.indexInformation.apply(collection, args);
  }

  initializeOrderedBulkOp(...args: any[]) {
    const collection = this._connect();

    return collection.initializeOrderedBulkOp.apply(collection, args);
  }

  initializeUnorderedBulkOp(...args: any[]) {
    const collection = this._connect();

    return collection.initializeUnorderedBulkOp.apply(collection, args);
  }

  insertMany(docs: object[], ...rest: any[]) {
    docs = docs.map((doc) => this._validate(doc));

    const collection = this._connect();

    return collection.insertMany.apply(collection, [docs, ...rest]);
  }

  insertOne(doc: object, ...rest: any[]) {
    doc = this._validate(doc);

    const collection = this._connect();

    return collection.insertOne.apply(collection, [doc, ...rest]);
  }

  isCapped(...args: any[]) {
    const collection = this._connect();

    return collection.isCapped.apply(collection, [args]);
  }

  listIndexes(...args: any[]) {
    const collection = this._connect();

    return collection.listIndexes.apply(collection, args);
  }

  mapReduce(...args: any[]) {
    const collection = this._connect();

    return collection.mapReduce.apply(collection, args);
  }

  options(...args: any[]) {
    const collection = this._connect();

    return collection.options.apply(collection, args);
  }

  parallelCollectionScan(...args: any[]) {
    const collection = this._connect();

    return collection.parallelCollectionScan.apply(collection, args);
  }

  reIndex(...args: any[]) {
    const collection = this._connect();

    return collection.reIndex.apply(collection, args);
  }

  // rename ?

  replaceOne(filter: object, doc: object, ...rest: any[]) {
    doc = this._validate(doc, false);

    const collection = this._connect();

    return collection.replaceOne.apply(collection, [filter, doc, ...rest]);
  }

  stats(...args: any[]) {
    const collection = this._connect();

    return collection.stats.apply(collection, args);
  }

  updateMany(filter: object, update: OBJ, ...rest: any[]) {
    update.$set = this._validate(update.$set, false);

    const collection = this._connect();

    return collection.updateMany.apply(collection, [filter, update, ...rest]);
  }

  updateOne(filter: object, update: OBJ, ...rest: any[]) {
    update.$set = this._validate(update.$set, false);

    const collection = this._connect();

    return collection.updateOne.apply(collection, [filter, update, ...rest]);
  }

  watch(...args: any[]) {
    const collection = this._connect();

    return collection.watch.apply(collection, args);
  }
}

export = Collection;
