import * as mongodb from "mongodb";
import * as connect from "./connect";
import * as Schema from "./Schema";
import * as types from "./types";
import TypeObjectId from "./types/ObjectId";
import CollectionConstructor, { Collection } from "./native/Collection";
import GraphQLConstructor, { GraphQL } from "./graphql/Model";
import RelationConstructor, { Relation } from "./relation";
import { mixins, define } from "../utils";
import * as utils from "./utils";

module ModelConstructor {
  export interface SchemaDefinition {
    [key: string]: any;
  }

  export interface Schema {
    [key: string]: any;

    _id?: mongodb.ObjectId;
  }
}

interface ModelConstructor extends CollectionConstructor, RelationConstructor, GraphQLConstructor {
  readonly prototype: Model;

  connection: string;
  collection: string;
  timestamps: boolean;
  schema: ModelConstructor.SchemaDefinition;
  types: typeof types;

  new(): Model;
}

export interface Model extends Collection, Relation, GraphQL { }

@mixins(CollectionConstructor, RelationConstructor, GraphQLConstructor)
export class Model implements Collection, Relation, GraphQL {
  static toString() {
    return this._collection;
  }

  static types = types;

  static connection: string = "default";

  static collection: string;

  static timestamps: boolean = true;

  static schema: ModelConstructor.SchemaDefinition = {};

  // TODO
  // static hidden: string[] = [];

  private _relations: string[] = [];

  private static get _collection() {
    return this.collection || utils.makeTableName(this.name);
  }

  private static get _schema() {
    const schema = Object.assign({}, this.schema, {
      _id: this.types.ObjectId,
    });

    if (!this.timestamps) return schema;

    return Object.assign({}, schema, {
      created_at: this.types.Date.default(() => new Date()),
      updated_at: this.types.Date,
    });
  }

  attributes: ModelConstructor.Schema = {};

  constructor(document: object = {}) {
    this._attributes((this.constructor as typeof Model)._validate(document));
  }

  private _attributes(attributes: { [key: string]: any }) {
    /**
     * @see https://github.com/TooTallNate/array-index
     * @see https://github.com/bevry/getsetdeep
     * @see https://github.com/aptana/activejs
     */
    const schema = (this.constructor as typeof Model)._schema;

    for (const attr in schema) {
      const getterName = utils.getGetterName(attr);
      const setterName = utils.getSetterName(attr);

      const getter = (this as any)[getterName] || ((origin: any) => origin);
      define(this, "get", attr, () => getter(this.attributes[attr]));

      const setter = (this as any)[setterName] || ((origin: any) => origin);
      define(this, "set", attr, (value) => this.attributes[attr] = setter(value));

      if (attributes[attr]) this.attributes[attr] = setter(attributes[attr]);
    }
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

const ModelConstructor: ModelConstructor = Model as any;

export default ModelConstructor;

/**
 * FIXME I know this seems ugly but in my defense,
 * `Typescript` doesn't support static method inside interfaces
 */
module.exports = exports.default;
module.exports.default = exports.default;
