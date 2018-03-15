import * as mongodb from "mongodb";
import * as async from "async";
import * as Model from "../Model";
import * as HasMany from "./HasMany";
import * as HasOne from "./HasOne";
import * as Cursor from "../native/Cursor";

declare module Relation {
  interface FindOneOptions {
    limit?: number;
    sort?: any[] | object;
    projection?: object;
    skip?: number;
    hint?: object;
    batchSize?: number;
    maxScan?: number;
    min?: number;
    max?: number;
    comment?: string;
    maxTimeMs?: number;
  }
}

declare interface Relation<TSchema = any> {
  [key: string]: any;

  find<T = TSchema>(query?: object): Cursor<T>;
  find<T = TSchema>(query: object, options?: Relation.FindOneOptions): Cursor<T>;

  findOne<T = TSchema>(filter: object, callback: mongodb.MongoCallback<T | null>): void;
  findOne<T = TSchema>(filter: object, options?: mongodb.FindOneOptions): Promise<T | null>;
  findOne<T = TSchema>(
    filter: object,
    options: mongodb.FindOneOptions,
    callback: mongodb.MongoCallback<T | null>,
  ): void;
}

class Relation {
  protected _relations: any;

  hasMany(model: typeof Model, localKey?: string, foreignKey?: string, relation?: string | typeof Model) {
    return new HasMany(<any>this, model, localKey, foreignKey, relation);
  }

  hasOne(model: typeof Model, localKey?: string, foreignKey?: string, relation?: string | typeof Model) {
    return new HasOne(<any>this, model, localKey, foreignKey, relation);
  }

  static with(...relations: string[]) {
    if (relations.length === 0) throw new TypeError("'relations' can't be an empty array");

    const model = new this();

    model._relations = relations;

    return model;
  }

  find(query?: object, options: Relation.FindOneOptions = {}) {
    if (this._relations.length === 0) throw new Error("Function 'find' doesn't exist");

    const pipeline: object[] = [];

    if (query) pipeline.push({
      $match: query,
    });

    if (options.skip) pipeline.push({ $skip: options.skip });
    if (options.limit) pipeline.push({ $limit: options.limit });

    const that = this;
    async.map(this._relations, (relation: any, cb) => {
      relation = that[relation];

      cb(undefined, {
        name: relation.name,
        relation: relation.apply(this),
      });
    }, (err, relations: any) => {
      if (err) throw err;

      relations.map((r: OBJ) => pipeline.push(...r.relation.stages(r.name)));
    });

    let sort = options.sort;
    if (sort)
      if (!Array.isInstance(sort))
        pipeline.push({ $sort: sort });
      else {
        sort.prepend({});
        sort = sort.reduce((acc: any, o: [string, number]) => Object.assign({}, acc, { [o.first()]: o.last() }));
        pipeline.push({ $sort: sort });
      }

    if (options.projection) pipeline.push({ $project: options.projection });

    let result = (this.constructor as any).aggregate(pipeline);

    if (options.hint) result = result.hint(options.hint);
    if (options.maxScan) result = result.maxScan(options.maxScan);
    if (options.max) result = result.max(options.max);
    if (options.min) result = result.min(options.min);
    if (options.comment) result = result.comment(options.comment);
    if (options.maxTimeMs) result = result.maxTimeMS(options.maxTimeMs);
    if (options.batchSize) result = result.batchSize(options.batchSize);

    return result;
  }

  async findOne(
    filter: object,
    options: Relation.FindOneOptions | mongodb.MongoCallback<any | null> = {},
    callback?: mongodb.MongoCallback<any | null>,
  ) {
    if (this._relations.length === 0) throw new Error("Function 'findOne' doesn't exist");

    if (Function.isInstance(options)) {
      callback = options;
      options = {};
    }

    const pipeline: object[] = [{
      $match: filter,
    }];

    if (options.skip) pipeline.push({ $skip: options.skip });
    if (options.limit) pipeline.push({ $limit: options.limit || 1 });

    const that = this;
    async.map(this._relations, (relation: any, cb) => {
      relation = that[relation];

      cb(undefined, {
        name: relation.name,
        relation: relation.apply(this),
      });
    }, (err, relations: any) => {
      if (err) throw err;

      relations.map((r: OBJ) => pipeline.push(...r.relation.stages(r.name)));
    });

    let sort = options.sort;
    if (sort)
      if (!Array.isInstance(sort))
        pipeline.push({ $sort: sort });
      else {
        sort.prepend({});
        sort = sort.reduce((acc: any, o: [string, number]) => Object.assign({}, acc, { [o.first()]: o.last() }));
        pipeline.push({ $sort: sort });
      }

    if (options.projection) pipeline.push({ $project: options.projection });

    let result: Cursor<any> = (this.constructor as any).aggregate(pipeline);

    if (options.hint) result = result.hint(options.hint);
    if (options.maxScan) result = result.maxScan(options.maxScan);
    if (options.max) result = result.max(options.max);
    if (options.min) result = result.min(options.min);
    if (options.comment) result = result.comment(options.comment);
    if (options.maxTimeMs) result = result.maxTimeMS(options.maxTimeMs);
    if (options.batchSize) result = result.batchSize(options.batchSize);

    if (callback)
      return result.toArray((err, item) => {
        if (Array.isInstance(item)) item = item.first();

        (callback as any)(err, item);
      });

    return (await result.toArray() as any[]).first();
  }
}

export = Relation;
