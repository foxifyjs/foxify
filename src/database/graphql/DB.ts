import * as GraphQLBase from "graphql";
import Model from "../Model";
import TypeAny from "../types/Any";

module toGraphQL {
  export interface Queries {
    [query: string]: any;
  }
}

const toGraphQL = (...models: Array<typeof Model>) => {
  const queries: toGraphQL.Queries = {};
  const mutations: toGraphQL.Queries = {};

  models.map((Model) => {
    const gql = Model.toGraphQL();

    Object.assign(queries, gql.queries);

    Object.assign(mutations, gql.mutations);
  });

  return new GraphQLBase.GraphQLSchema({
    query: new GraphQLBase.GraphQLObjectType({
      name: "Query",
      fields: queries,
    }),
    mutation: new GraphQLBase.GraphQLObjectType({
      name: "Mutation",
      fields: mutations,
    }),
  });
};

export default toGraphQL;
