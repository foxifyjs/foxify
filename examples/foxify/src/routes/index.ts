import { STATUS, HttpError } from "@foxify/http";
import Router, { SchemaOptionsI } from "@foxify/router";

const router = (new Router);

router.get("/", (req, res) => {
  res.render("index", {
    logo : "https://avatars1.githubusercontent.com/u/36167886?s=200&v=4",
    title: "Foxify",
  });
});

router.get("/greet", (req, res) => {
  res.json({
    hello: "world",
  });
});

const schema: SchemaOptionsI = {
  response: {
    200: {
      type      : "object",
      properties: {
        hello: {
          type: "string",
        },
      },
    },
  },
};

router.get("/greet-fast", {
  schema,
}, (req, res) => {
  res.json({
    hello: "world",
  });
});

router.get("/404", () => {
  throw new HttpError("This is a demo", STATUS.NOT_FOUND);
});

router.get("/error", async () => {
  throw new Error("Oops!");
});

export default router;
