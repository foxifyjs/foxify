import {
  foxify,
  foxifyOld,
  call,
  express,
  findMyWay,
  koaRouter,
  koaTreeRouter,
  trekRouter,
  noop,
} from "../routers/index.js";

export default [
  [
    "@foxify/router",
    (): void => {
      foxify.find("GET", "/user");
      foxify.find("GET", "/user/comments");
      foxify.find("GET", "/user/lookup/username/john");
      foxify.find("GET", "/event/abcd1234/comments");
      foxify.find("GET", "/very/deeply/nested/route/hello/there");
      foxify.find("GET", "/static/index.html");
    },
  ],
  [
    "foxify (v0.10.20)",
    (): void => {
      foxifyOld.find("GET", "/user");
      foxifyOld.find("GET", "/user/comments");
      foxifyOld.find("GET", "/user/lookup/username/john");
      foxifyOld.find("GET", "/event/abcd1234/comments");
      foxifyOld.find("GET", "/very/deeply/nested/route/hello/there");
      foxifyOld.find("GET", "/static/index.html");
    },
  ],
  [
    "@hapi/call",
    (): void => {
      call.route("get", "/user");
      call.route("get", "/user/comments");
      call.route("get", "/user/lookup/username/john");
      call.route("get", "/event/abcd1234/comments");
      call.route("get", "/very/deeply/nested/route/hello/there");
      call.route("get", "/static/index.html");
    },
  ],
  [
    "express",
    (): void => {
      express.handle({
        method: "GET",
        url   : "/user",
      });
      express.handle({
        method: "GET",
        url   : "/user/comments",
      });
      express.handle({
        method: "GET",
        url   : "/user/lookup/username/john",
      });
      express.handle(
        {
          method: "GET",
          url   : "/event/abcd1234/comments",
        },
        null,
        noop,
      );
      express.handle(
        {
          method: "GET",
          url   : "/very/deeply/nested/route/hello/there",
        },
        null,
        noop,
      );
      express.handle({
        method: "GET",
        url   : "/static/index.html",
      }, null, noop);
    },
  ],
  [
    "find-my-way",
    (): void => {
      findMyWay.find("GET", "/user");
      findMyWay.find("GET", "/user/comments");
      findMyWay.find("GET", "/user/lookup/username/john");
      findMyWay.find("GET", "/event/abcd1234/comments");
      findMyWay.find("GET", "/very/deeply/nested/route/hello/there");
      findMyWay.find("GET", "/static/index.html");
    },
  ],
  [
    "koa-router",
    (): void => {
      koaRouter.match("/user", "GET");
      koaRouter.match("/user/comments", "GET");
      koaRouter.match("/user/lookup/username/john", "GET");
      koaRouter.match("/event/abcd1234/comments", "GET");
      koaRouter.match("/very/deeply/nested/route/hello/there", "GET");
      koaRouter.match("/static/index.html", "GET");
    },
  ],
  [
    "koa-tree-router",
    (): void => {
      koaTreeRouter.find("GET", "/user");
      koaTreeRouter.find("GET", "/user/comments");
      koaTreeRouter.find("GET", "/user/lookup/username/john");
      koaTreeRouter.find("GET", "/event/abcd1234/comments");
      koaTreeRouter.find("GET", "/very/deeply/nested/route/hello/there");
      koaTreeRouter.find("GET", "/static/index.html");
    },
  ],
  [
    "trek-router",
    (): void => {
      trekRouter.find("GET", "/user");
      trekRouter.find("GET", "/user/comments");
      trekRouter.find("GET", "/user/lookup/username/john");
      trekRouter.find("GET", "/event/abcd1234/comments");
      trekRouter.find("GET", "/very/deeply/nested/route/hello/there");
      trekRouter.find("GET", "/static/index.html");
    },
  ],
];
