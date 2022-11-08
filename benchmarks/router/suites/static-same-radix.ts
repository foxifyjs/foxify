import {
  foxify,
  foxifyOld,
  call,
  express,
  findMyWay,
  koaRouter,
  koaTreeRouter,
  trekRouter,
} from "../routers/index.js";

const PATH = "/user/comments";

export default [
  [
    "@foxify/router",
    (): any => foxify.find("GET", PATH),
  ],
  [
    "foxify (v0.10.20)",
    (): any => foxifyOld.find("GET", PATH),
  ],
  [
    "@hapi/call",
    (): any => call.route("get", PATH),
  ],
  [
    "express",
    (): any => express.handle({
      method: "GET",
      url   : PATH,
    }),
  ],
  [
    "find-my-way",
    (): any => findMyWay.find("GET", PATH),
  ],
  [
    "koa-router",
    (): any => koaRouter.match(PATH, "GET"),
  ],
  [
    "koa-tree-router",
    (): any => koaTreeRouter.find("GET", PATH),
  ],
  [
    "trek-router",
    (): any => trekRouter.find("GET", PATH),
  ],
];
