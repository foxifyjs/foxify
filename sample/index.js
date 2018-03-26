const path = require("path");
const morgan = require("morgan");
const graphqlHTTP = require('express-graphql');
const Foxify = require("../framework");
const users = require("./routes/users");
const index = require("./routes/index");

Foxify.dotenv(path.join(__dirname, ".env"));

const app = new Foxify();

// template engine support
app.engine("ejs", path.join(__dirname, "views"), require("ejs").__express)

// middlewares
app.use(
  Foxify.static(path.join(__dirname, "public")), // static serve support
  morgan("dev"), // express middleware support
);

// routes
app.use(index)
  .use(users);

// graphql support
app.use('/graphql', graphqlHTTP({
  schema: Foxify.DB.toGraphQL(...require("./models")),
  graphiql: true,
}));

// start the app
app.start(() =>
  console.log(`Foxify server running at http://${app.get("url")}:${app.get("port")} (worker: ${process.pid})`));
