import './bootstrap'
import * as http from 'http'
import * as path from 'path'
import * as serveStatic from 'serve-static'
import * as DB from './database'
import * as constants from './constants'
import { Router, Route, httpMethods } from './routing'
import { init, query } from './middleware'
import { request, response } from './patches'
import { Engine } from './view'
import { name } from '../package.json'

declare module Foxify {
}

declare interface Foxify {
  [key: string]: any

  use(route: Route): void
  use(middleware: Route.Controller): void
  use(path: string, controller: Route.Controller): void

  start(): void
  start(callback?: () => void): void
  start(url: string, callback?: () => void): void
  start(port: number, callback?: () => void): void
  start(url: string, port: number, callback?: () => void): void
}

class Foxify {
  static constants = constants
  static static = serveStatic
  static DB = DB
  static Route = Route

  view?: Engine

  protected _router = new Router()

  constructor() {
    if (process.env.DATABASE_NAME) {
      /* apply default db connection */
      Foxify.DB.connections({
        default: {
          host: process.env.DATABASE_HOST,
          port: process.env.DATABASE_PORT,
          database: process.env.DATABASE_NAME,
          user: process.env.DATABASE_USER,
          password: process.env.DATABASE_PASSWORD
        }
      })
    }

    /* apply http routing methods */
    httpMethods.map((method) => {
      method = method.toLowerCase()

      if (!this[method]) {
        this[method] = (path: string, controller: Route.Controller) => {
          let route = new Route()

          route[method](path, controller)

          this._router.push(route.routes)
        }
      }
    })

    /* apply default middlewares */
    this.use(init)
    this.use(query())
  }

  engine(extention: string, path: string, handler: Function) {
    this.view = new Engine(path, extention, handler)
  }

  use(
    first: Route.Controller | string | Route = () => { },
    second?: Route.Controller
  ) {
    if (first instanceof Route) return this._router.push(first.routes)

    let route = new Route()

    route.use(first, second)

    this._router.push(route.routes)
  }

  start(
    url: string | number | (() => void) = process.env.APP_URL || 'localhost',
    port: number | (() => void) = +(process.env.APP_PORT || '3000'),
    callback?: () => void
  ) {
    if (Function.isInstance(url)) {
      callback = url
      url = 'localhost'
      port = 3000
    }

    if (Number.isInstance(url)) {
      if (Function.isInstance(port)) callback = port

      port = url
      url = 'localhost'
    }

    if (Function.isInstance(port)) {
      callback = port
      port = 3000
    }

    /* apply http patches */
    request(http.IncomingMessage)
    response(http.ServerResponse)
    Engine.responsePatch(http.ServerResponse, this.view)

    /* no server fail at any cost */
    process.on('uncaughtException', (err) => console.error('Caught exception: ' + err))
    process.on('unhandledRejection', (err) => console.warn('Caught rejection: ' + err))

    let server = http.createServer((req, res) => this._router.route(req, res))

    server.listen(port, url, callback)
  }
}

export = Foxify
