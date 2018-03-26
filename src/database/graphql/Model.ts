import * as GraphQLBase from "graphql";
import Model from "../Model";
import { ObjectId } from "../index";
import TypeAny from "../types/Any";

const _schema = (model: string, schema: Model.SchemaDefinition) => {
  const fields: GraphQLConstructor.Schema = {};
  const args: any = {};

  for (const key in schema) {
    const type = schema[key];

    if (type instanceof TypeAny) {
      // Type

      const gql = type.toGraphQL(model, key);

      fields[key] = { type: gql.field as any };
      args[key] = { type: gql.arg };
    } else {
      // Object
      const schema = _schema(model, type);

      fields[key] = {
        type: new GraphQLBase.GraphQLObjectType({
          name: `${model}_${key}`,
          fields: schema.fields,
        }),
      };

      args[key] = {
        type: new GraphQLBase.GraphQLInputObjectType({
          name: `${model}_${key}_input`,
          fields: schema.args,
        }),
      };
    }
  }

  return {
    fields,
    args,
  };
};

const _projection = (fieldASTs: any) => {
  return fieldASTs.selectionSet.selections.reduce((projections: any, selection: any) => {
    projections[selection.name.value] = 1;

    return projections;
  }, {});
};

const _prepare = (item: { [field: string]: any }) => {
  if (item && item._id) item._id = item._id.toString();

  return item;
};

module GraphQLConstructor {
  export interface Schema {
    [key: string]: {
      type: GraphQLBase.GraphQLOutputType,
    };
  }
}

interface GraphQLConstructor {
  toGraphQL(): any;
}

export class GraphQL {
  static toGraphQL() {
    const name = this.name;

    const single = this.toString().replace(/s$/, "");
    const multiple = this.toString();

    const schema = _schema(name, (this as any).schema);
    const fields = schema.fields;
    const args = {
      _id: {
        type: GraphQLBase.GraphQLID,
      },
      ...schema.args,
    };

    const type = new GraphQLBase.GraphQLObjectType({
      name,
      fields: {
        _id: {
          type: new GraphQLBase.GraphQLNonNull(GraphQLBase.GraphQLID),
        },
        ...fields,
      },
    });

    const queries = {
      [single]: {
        type,
        args,
        resolve: async (root: any, params: any, options: any, fieldASTs: any) => {
          const projection = _projection(fieldASTs.fieldNodes[0]);

          if (params._id) params._id = new ObjectId(params._id);

          return _prepare(await (this as any).findOne(params, projection));
        },
      },
      [multiple]: {
        type: new GraphQLBase.GraphQLList(type),
        args,
        resolve: async (root: any, params: any, options: any, fieldASTs: any) => {
          const projection = _projection(fieldASTs.fieldNodes[0]);

          if (params._id) params._id = new ObjectId(params._id);

          const items = await (this as any).find(params, projection).toArray();

          return items.map(_prepare);
        },
      },
    };

    const inputType = new GraphQLBase.GraphQLInputObjectType({
      name: `${name}Input`,
      fields: schema.args,
    });

    const mutations = {
      [`insert_${single}`]: {
        type,
        args: {
          data: {
            type: new GraphQLBase.GraphQLNonNull(inputType),
          },
        },
        resolve: async (root: any, params: any, options: any, fieldASTs: any) => {
          const item = await (this as any).insertOne(params.data);

          return item.ops.first();
        },
      },
      [`insert_${multiple}`]: {
        type: new GraphQLBase.GraphQLList(type),
        args: {
          data: {
            type: new GraphQLBase.GraphQLList(new GraphQLBase.GraphQLNonNull(inputType)),
          },
        },
        resolve: async (root: any, params: any, options: any, fieldASTs: any) => {
          const item = await (this as any).insertMany(params.data);

          return item.ops;
        },
      },
      [`update_${single}`]: {
        type: GraphQLBase.GraphQLBoolean,
        args: {
          query: {
            type: new GraphQLBase.GraphQLNonNull(inputType),
          },
          data: {
            type: new GraphQLBase.GraphQLNonNull(inputType),
          },
        },
        resolve: async (root: any, params: any, options: any, fieldASTs: any) => {
          const result = await (this as any).updateOne(params.query, { $set: params.data });

          return Boolean(result.modifiedCount);
        },
      },
      [`update_${multiple}`]: {
        type: GraphQLBase.GraphQLInt,
        args: {
          query: {
            type: new GraphQLBase.GraphQLNonNull(inputType),
          },
          data: {
            type: new GraphQLBase.GraphQLNonNull(inputType),
          },
        },
        resolve: async (root: any, params: any, options: any, fieldASTs: any) => {
          const result = await (this as any).updateMany(params.query, { $set: params.data });

          return result.modifiedCount;
        },
      },
      [`delete_${single}`]: {
        type: GraphQLBase.GraphQLBoolean,
        args: {
          data: {
            type: new GraphQLBase.GraphQLNonNull(inputType),
          },
        },
        resolve: async (root: any, params: any, options: any, fieldASTs: any) => {
          const result = await (this as any).deleteOne(params.data);

          return Boolean(result.deletedCount);
        },
      },
      [`delete_${multiple}`]: {
        type: GraphQLBase.GraphQLInt,
        args: {
          data: {
            type: new GraphQLBase.GraphQLNonNull(inputType),
          },
        },
        resolve: async (root: any, params: any, options: any, fieldASTs: any) => {
          const result = await (this as any).deleteMany(params.data);

          return result.deletedCount;
        },
      },
    };

    return {
      queries,
      mutations,
    };
  }
}

const GraphQLConstructor: GraphQLConstructor = GraphQL as any;

export default GraphQLConstructor;

/**
 * FIXME I know this seems ugly but in my defense,
 * `Typescript` doesn't support static method inside interfaces
 */
module.exports = exports.default;
module.exports.default = exports.default;
