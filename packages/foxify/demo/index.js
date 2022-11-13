/* eslint-disable @typescript-eslint/no-require-imports,@typescript-eslint/no-var-requires */
const path = require("path");
const morgan = require("morgan");
const Foxify = require("..").default;
const routes = require("./routes");

Foxify.dotenv(path.join(__dirname, ".env"));

const app = (new Foxify);

// Template engine support
// eslint-disable-next-line no-underscore-dangle
app.engine("ejs", path.join(__dirname, "views"), require("ejs").__express);

// Middlewares & routes
app.use(

  // Static serve support
  Foxify.static(path.join(__dirname, "public")),

  // Express middleware support
  morgan("dev"),

  // Routes
  routes,
);

// Start the app
app.start(() => console.info(`Foxify server running at http://${ app.get("url") }:${ app.get("port") } (worker: ${ process.pid })`));

console.info(app.prettyPrint());
