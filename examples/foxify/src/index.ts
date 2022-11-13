import path from "node:path";
import url from "node:url";
import Foxify from "foxify";
import morgan from "morgan";
import routes from "./routes/index.js";

const ROOT_DIR = path.join(path.dirname(url.fileURLToPath(import.meta.url)), "..");

const app = (new Foxify);

// Settings
app
  .set("url", "localhost")
  .set("port", 3000)
  .set("workers", 1);

// Template engine support
app.engine(
  "ejs",
  path.join(ROOT_DIR, "views"),
  // eslint-disable-next-line no-underscore-dangle,@typescript-eslint/no-explicit-any
  (await import("ejs") as any).__express,
);

// Static serve support
app.use(Foxify.static(path.join(ROOT_DIR, "public")));

// Express middleware support
app.use(morgan("dev"));

// Routes
app.use(routes);

// Log the routes
console.info(app.prettyPrint());

// Start the app
app.start(() => console.info(`Foxify server running at http://${ app.setting("url") }:${ app.setting("port") } (worker: ${ process.pid })`));
