import hapi from "@hapi/hapi/package.json" assert { type: "json" };
import connect from "connect/package.json" assert { type: "json" };
import express from "express/package.json" assert { type: "json" };
import fastify from "fastify/package.json" assert { type: "json" };
import foxify from "foxify/package.json" assert { type: "json" };
import foxifyOld from "foxify-old/package.json" assert { type: "json" };
import koa from "koa/package.json" assert { type: "json" };
import koaRouter from "koa-router/package.json" assert { type: "json" };
import micro from "micro/package.json" assert { type: "json" };
import microRouter from "microrouter/package.json" assert { type: "json" };
import polka from "polka/package.json" assert { type: "json" };
import rayo from "rayo/package.json" assert { type: "json" };
import restify from "restify/package.json" assert { type: "json" };
import router from "router/package.json" assert { type: "json" };
import takeFive from "take-five/package.json" assert { type: "json" };
import total from "total.js/package.json" assert { type: "json" };
import trekEngine from "trek-engine/package.json" assert { type: "json" };
import trekEngineRouter from "trek-router/package.json" assert { type: "json" };

const PACKAGES = {
  bare: {
    version: process.version.slice(1),
    router : false,
  },
  connect: {
    version: connect.version,
    router : false,
  },
  express: {
    version: express.version,
    router : true,
  },
  fastify: {
    version: fastify.version,
    router : true,
  },
  foxify: {
    version: foxify.version,
    router : true,
  },
  foxifyOld: {
    version: foxifyOld.version,
    router : true,
  },
  hapi: {
    version: hapi.version,
    router : true,
  },
  koa: {
    version: koa.version,
    router : false,
  },
  koaRouter: {
    version: koaRouter.version,
    router : true,
  },
  micro: {
    version: micro.version,
    router : false,
  },
  microRouter: {
    version: microRouter.version,
    router : true,
  },
  polka: {
    version: polka.version,
    router : true,
  },
  rayo: {
    version: rayo.version,
    router : true,
  },
  restify: {
    version: restify.version,
    router : true,
  },
  router: {
    version: router.version,
    router : true,
  },
  takeFive: {
    version: takeFive.version,
    router : true,
  },
  total: {
    version: total.version,
    router : true,
  },
  trekEngine: {
    version: trekEngine.version,
    router : false,
  },
  trekEngineRouter: {
    version: trekEngineRouter.version,
    router : true,
  },
};

export default {
  bare                         : PACKAGES.bare,
  connect                      : PACKAGES.connect,
  "connect-router"             : PACKAGES.router,
  express                      : PACKAGES.express,
  "express-with-middlewares"   : PACKAGES.express,
  fastify                      : PACKAGES.fastify,
  "fastify-with-middlewares"   : PACKAGES.fastify,
  foxify                       : PACKAGES.foxify,
  "foxify-with-middlewares"    : PACKAGES.foxify,
  "foxify-old"                 : PACKAGES.foxifyOld,
  "foxify-old-with-middlewares": PACKAGES.foxifyOld,
  hapi                         : PACKAGES.hapi,
  koa                          : PACKAGES.koa,
  "koa-router"                 : PACKAGES.koaRouter,
  micro                        : PACKAGES.micro,
  "micro-router"               : PACKAGES.microRouter,
  polka                        : PACKAGES.polka,
  rayo                         : PACKAGES.rayo,
  restify                      : PACKAGES.restify,
  "take-five"                  : PACKAGES.takeFive,
  "total.js"                   : PACKAGES.total,
  "trek-engine"                : PACKAGES.trekEngine,
  "trek-engine-router"         : PACKAGES.trekEngineRouter,
};
