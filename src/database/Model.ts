import * as mongodb from "mongodb";
import * as connect from "./connect";
import * as Collection from "./native/Collection";
import * as Relation from "./relation";
import * as Schema from "./Schema";
import * as types from "./types";
import { applyMixins, applyAsStaticMixins } from "../utils";

declare module Model {
  export interface SchemaDefinition {
    [key: string]: any;
  }

  export interface Schema {
    [key: string]: any;
  }
}

// declare interface Model extends Collection, Relation {
declare interface Model extends Relation {
}

/**
 *
 * @abstract
 */
// abstract class Model implements Collection, Relation {
abstract class Model implements Relation {
  protected static connection: string = "default";

  protected static collection: string;

  protected static schema: Model.SchemaDefinition = {};

  protected static hidden: string[] = [];

  static types = types;

  protected _relations: string[] = [];

  // constructor(document?: Partial<Model.Schema>) {
  //   if (document) {
  //     // TODO
  //   }
  // }

  static toString() {
    return this._collection;
  }

  private static get _collection() {
    return this.collection || `${this.name.snakeCase()}s`;
  }

  private static _connect(): mongodb.Collection {
    return __FOX__.db.connections[this.connection].collection(this._collection);
  }

  protected static _validate(document: Partial<Model.Schema>, required: boolean = true) {
    const validation = Schema.validate(this.schema, document);

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

applyMixins(Model, [Relation]);

applyAsStaticMixins(Model, [Collection]);

export = Model;
