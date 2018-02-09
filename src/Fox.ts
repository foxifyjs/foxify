import './bootstrap'
import * as http from 'http'
import * as path from 'path'
import * as serveStatic from 'serve-static'
import * as DB from './database'
import * as constants from './constants'
import { Router, Route } from './routing'
import { init, query } from './middleware'
import { Engine } from './view'
import { name } from '../package.json'

declare module Fox {
}

declare interface Fox {
  use(middleware: Route.Controller): void
  use(route: Route): void
  use(path: string, controller: Route.Controller): void
}

class Fox {
  static static = serveStatic
  static DB = DB
  static Route = Route
  static constants = constants

  view?: Engine

  protected _router = new Router()

  constructor() {
    this.engine(path.join(process.cwd(), 'views'), 'html', () => { })

    // apply default middlewares
    this.use(init(this))
    this.use(query({}))
  }

  engine = (extention: string, path: string, handler: Function) => this.view = new Engine(path, extention, handler)

  use(first: Route.Controller | string | Route = () => { }, second: Route.Controller = () => { }) {
    if (first instanceof Route) return this._router.push(first.routes)

    let route = new Route()

    route.use(first, second)

    this._router.push(route.routes)
  }

  start(url?: string, port?: number) {
    let server = http.createServer((req, res) => {
      this._router.route(req, res)
    })

    if (!url) url = process.env.APP_URL || 'localhost'

    if (!port) port = +(process.env.APP_PORT || '3000')

    server.listen(
      port,
      url,
      () => console.log(`${name.capitalize()} server running at http://${url}:${port}`)
    )
  }
}

export = Fox
