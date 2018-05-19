const path = require("path");
const morgan = require("morgan");
const Foxify = require("../framework");
const index = require("./routes");

Foxify.dotenv(path.join(__dirname, ".env"));

const app = new Foxify();

app.disable("content-length");

// template engine support
app.engine("ejs", path.join(__dirname, "views"), require("ejs").__express)

// middlewares
app.use(
  Foxify.static(path.join(__dirname, "public")), // static serve support
  morgan("dev"), // express middleware support
);

// routes
app.use(index);

// start the app
app.start(() =>
  console.log(`Foxify server running at http://${app.get("url")}:${app.get("port")} (worker: ${process.pid})`));
