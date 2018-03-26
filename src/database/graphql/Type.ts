import * as GraphQLBase from "graphql";

class GraphQL {
  toGraphQL(model: string, key: string) {
    let field: GraphQLBase.GraphQLType | undefined;
    let arg: GraphQLBase.GraphQLInputType | undefined;

    let typer = (type: GraphQLBase.GraphQLType) => type;
    if ((this as any)._required) typer = (type: GraphQLBase.GraphQLType) => new GraphQLBase.GraphQLNonNull(type);

    switch ((this as any)._type) {
      case "Array":
        const gql = (this as any).ofType.toGraphQL(model, key);

        field = typer(new GraphQLBase.GraphQLList(gql.field));
        arg = new GraphQLBase.GraphQLList(gql.arg);

        break;
      case "Boolean":
        field = typer(GraphQLBase.GraphQLBoolean);
        arg = GraphQLBase.GraphQLBoolean;

        break;
      case "Number":
        field = typer(GraphQLBase.GraphQLInt);
        arg = GraphQLBase.GraphQLInt;

        break;
      case "Object":
        field = typer(new GraphQLBase.GraphQLObjectType({
          name: `${model}_${key}`,
          fields: {},
        }));
        arg = new GraphQLBase.GraphQLInputObjectType({
          name: `${model}_${key}_input`,
          fields: {},
        });

        break;
      case "ObjectId":
        field = typer(GraphQLBase.GraphQLID);
        arg = GraphQLBase.GraphQLID;

        break;
      case "String":
        field = typer(GraphQLBase.GraphQLString);
        arg = GraphQLBase.GraphQLString;

        break;
    }

    return {
      field,
      arg,
    };
  }
}

export default GraphQL;
