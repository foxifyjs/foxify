const path = require("path");
const morgan = require("morgan");
const Foxify = require("..").default;
const index = require("./routes");

Foxify.dotenv(path.join(__dirname, ".env"));

const app = new Foxify();

// template engine support
app.engine("ejs", path.join(__dirname, "views"), require("ejs").__express)

// middlewares & routes
app.use(
  Foxify.static(path.join(__dirname, "public")), // static serve support
  morgan("dev"), // express middleware support
  index // routes
);

// start the app
app.start(() =>
  console.log(`Foxify server running at http://${app.get("url")}:${app.get("port")} (worker: ${process.pid})`));

console.log(app.prettyPrint());
