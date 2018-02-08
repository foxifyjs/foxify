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
