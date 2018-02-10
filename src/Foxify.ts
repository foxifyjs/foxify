import './bootstrap'
import * as http from 'http'
import * as path from 'path'
import * as serveStatic from 'serve-static'
import * as DB from './database'
import * as constants from './constants'
import { Router, Route, httpMethods } from './routing'
import { init, query } from './middleware'
import { request, response } from './prototypes'
import { Encapsulation } from './exeptions'
import { Engine } from './view'
import { name } from '../package.json'

declare module Foxify {
}

declare interface Foxify {
  [key: string]: any

  use(route: Route): void
  use(middleware: Route.Controller): void
  use(path: string, controller: Route.Controller): void
}

class Foxify {
  static constants = constants
  static static = serveStatic
  static DB = DB
  static Route = Route

  view?: Engine

  protected _router = new Router()

  constructor() {
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

  engine = (extention: string, path: string, handler: Function) => {
    this.view = new Engine(path, extention, handler)
  }

  use(first: Route.Controller | string | Route = () => { }, second?: Route.Controller) {
    if (first instanceof Route) return this._router.push(first.routes)

    let route = new Route()

    route.use(first, second)

    this._router.push(route.routes)
  }

  start(url?: string, port?: number) {
    if (!url) url = process.env.APP_URL || 'localhost'
    if (!port) port = +(process.env.APP_PORT || '3000')

    /* apply http patches */
    request(http.IncomingMessage)
    response(http.ServerResponse)
    Engine.responsePatch(http.ServerResponse, this.view)

    const encapsulation = new Encapsulation((req: http.IncomingMessage, res: http.ServerResponse) => this._router.route(req, res))

    /* creating server */
    let server = http.createServer((req, res) => encapsulation.run(req, res))

    server.listen(port, url,
      () => console.log(`${name.capitalize()} server running at http://${url}:${port}`))
  }
}

export = Foxify
