import * as mongodb from "mongodb";
import * as connect from "./connect";
import * as Schema from "./Schema";
import * as types from "./types";
import CollectionConstructor, { Collection } from "./native/Collection";
import GraphQLConstructor, { GraphQL } from "./graphql/Model";
import RelationConstructor, { Relation } from "./relation";
import { mixins } from "../utils";

module ModelConstructor {
  export interface SchemaDefinition {
    [key: string]: any;
  }

  export interface Schema {
    [key: string]: any;
  }
}

interface ModelConstructor extends CollectionConstructor, RelationConstructor, GraphQLConstructor {
  readonly prototype: Model;

  connection: string;
  collection: string;
  datetimes: boolean;
  schema: ModelConstructor.SchemaDefinition;
  types: typeof types;

  new(): Model;
}

export interface Model extends Collection, Relation, GraphQL { }

@mixins(CollectionConstructor, RelationConstructor, GraphQLConstructor)
export class Model implements Collection, Relation, GraphQL {
  static connection: string = "default";

  static collection: string;

  static datetimes: boolean = true;

  static schema: ModelConstructor.SchemaDefinition = {};

  // TODO
  // static hidden: string[] = [];

  static types = types;

  private _relations: string[] = [];

  static toString() {
    return this._collection;
  }

  private static get _collection() {
    return this.collection || `${this.name.snakeCase()}s`;
  }

  private static get _schema() {
    if (!this.datetimes) return this.schema;

    return Object.assign({}, this.schema, {
      created_at: this.types.Date.default(() => new Date()),
      updated_at: this.types.Date,
    });
  }

  private static _connect(): mongodb.Collection {
    return __FOX__.db.connections[this.connection].collection(this._collection);
  }

  private static _validate(document: Partial<ModelConstructor.Schema>, required: boolean = true) {
    const validation = Schema.validate(this._schema, document);

    if (validation.errors && !required) {
      validation.errors.map((errors, key) => {
        if (errors.length === 1 && errors.first() === "Must be provided")
          delete (validation.errors as any)[key];
      });

      if (validation.errors.size() === 0) validation.errors = null;
    }

    if (validation.errors) throw new HttpExeption(500, validation.errors);

    return validation.value;
  }
}

const ModelConstructor: ModelConstructor = <any>Model;

export default ModelConstructor;

/**
 * FIXME I know this seems ugly but in my defense,
 * `Typescript` doesn't support static method inside interfaces
 */
module.exports = exports.default;
module.exports.default = exports.default;
