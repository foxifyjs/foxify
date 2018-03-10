import './bootstrap'
import * as cluster from 'cluster'
import * as os from 'os'
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

declare interface Foxify {
  [key: string]: any

  use(route: Route): void
  use(middleware: Route.Controller): void
  use(path: string, controller: Route.Controller): void
}

declare module Foxify {
}

class Foxify {
  static constants = constants
  static DB = DB
  static route = (prefix?: string) => new Route(prefix)
  static static = serveStatic

  protected _options = {
    'x-powered-by': true,
    routing: {
      strict: false,
      sensitive: true,
    },
    json: {
      escape: false,
    }
  }

  protected _settings = {
    env: process.env.NODE_ENV || 'production',
    url: process.env.APP_URL || 'localhost',
    port: process.env.APP_PORT ? +process.env.APP_PORT : 3000,
    workers: process.env.WORKERS ? +process.env.WORKERS : os.cpus().length,
    json: {
      replacer: null,
      spaces: null
    },
    query: {
      parser: null
    }
  }

  protected _router = new Router()

  protected _view?: Engine

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

          return this
        }
      }
    })
  }

  /* handle options & settings */
  protected _set(setting: string, value: any, object: OBJ) {
    let keys = setting.split('.')

    if (keys.length == 1) {
      object[keys.first()] = value
    } else {
      this._set(keys.tail().join('.'), value, object[keys.first()])
    }
  }

  /* handle options */
  enable(option: string) {
    if (!String.isInstance(option)) throw new TypeError('Argument \'option\' should be an string')

    if (!['x-powered-by', 'routing.strict', 'routing.sensitive', 'json.escape'].contains(option))
      throw new TypeError(`Unknown option '${option}'`)

    this._set(option, true, this._options)

    return this
  }

  disable(option: string) {
    if (!String.isInstance(option)) throw new TypeError('Argument \'option\' should be an string')

    if (!['x-powered-by', 'routing.strict', 'routing.sensitive', 'json.escape'].contains(option))
      throw new TypeError(`Unknown option '${option}'`)

    this._set(option, false, this._options)

    return this
  }

  enabled(option: string): boolean {
    if (!String.isInstance(option)) throw new TypeError('Argument \'option\' should be an string')

    if (!['x-powered-by', 'routing.strict', 'routing.sensitive', 'json.escape'].contains(option))
      throw new TypeError(`Unknown option '${option}'`)

    let keys = option.split('.')

    let _opt: any = this._options

    keys.map((key) => {
      if (Boolean.isInstance(_opt)) throw new Error('Unknown option')

      _opt = _opt[key]
    })

    return _opt
  }

  disabled(option: string): boolean {
    return !this.enabled(option)
  }

  /* handle settings */
  set(setting: string, value: any) {
    if (!String.isInstance(setting)) throw new TypeError('Argument \'setting\' should be an string')

    switch (setting) {
      case 'env':
      case 'url':
        if (!String.isInstance(value)) throw new TypeError(`setting '${setting}' should be an string`)
        break
      case 'port':
      case 'workers':
        if (!Number.isInstance(value)) throw new TypeError(`setting '${setting}' should be a number`)
        if (value < 1) throw new TypeError(`setting '${setting}' should be a positive number`)
        break
      case 'json.spaces':
        if (value == null) break
        if (!Number.isInstance(value)) throw new TypeError(`setting '${setting}' should be a number`)
        if (value < 0) throw new TypeError(`setting '${setting}' should be a positive number or zero`)
        break
      case 'json.replacer':
      case 'query.parser':
        if (value == null) break
        if (!Function.isInstance(value)) throw new TypeError(`setting '${setting}' should be a function`)
        break
      default:
        throw new TypeError(`Unknown setting '${setting}'`)
    }

    this._set(setting, value, this._settings)

    return this
  }

  get(...args: any[]): any {
    let length = args.length

    if (length == 0 || length > 2) throw new TypeError('\'args\' should be an array of 1 or 2 values')

    if (length == 1) {
      let setting: string = args.first()

      if (!String.isInstance(setting)) throw new TypeError('\'setting\' should be an string')

      if (
        !['env', 'url', 'port', 'workers', 'json.spaces', 'json.replacer',
          'query.parser'].contains(setting)
      ) throw new TypeError(`Unknown setting '${setting}'`)

      let keys = setting.split('.')

      let _setting: OBJ | boolean = this._settings

      keys.map((key) => {
        if (!Object.isInstance(_setting)) throw new Error('Unknown setting')

        _setting = (_setting as OBJ)[key]
      })

      return _setting
    }

    let path: string = args.first()
    let controller: Route.Controller = args.last()

    let route = new Route()

    route.get(path, controller)

    this._router.push(route.routes)

    return this
  }

  /* handle view */
  engine(extention: string, path: string, handler: Function) {
    this._view = new Engine(path, extention, handler)

    return this
  }

  /* handle built-in middlewares */
  protected _use(
    first: Route.Controller | string | Route = () => { },
    second?: Route.Controller
  ) {
    if (first instanceof Route) {
      this._router.push(first.routes)
    } else {
      let route = new Route()

      route.use(first, second)

      this._router.prepend(route.routes)
    }

    return this
  }

  /* handle middlewares */
  use(
    first: Route.Controller | string | Route = () => { },
    second?: Route.Controller
  ) {
    if (first instanceof Route) {
      this._router.push(first.routes)
    } else {
      let route = new Route()

      route.use(first, second)

      this._router.push(route.routes)
    }

    return this
  }

  start(callback?: () => void) {
    if (callback && !Function.isInstance(callback)) throw new TypeError('Argument \'callback\' must be a function')

    /* set node env */
    process.env.NODE_ENV = this.get('env')

    /* apply built-in middlewares */
    this._use(init(this))
      ._use(query(this))

    /* apply http patches */
    request(http.IncomingMessage, this)
    response(http.ServerResponse, this)
    Engine.responsePatch(http.ServerResponse, this._view)

    /* initialize the router with provided options and settings */
    this._router.initialize(this)

    /* apply workers */
    const workers = this.get('workers')
    if (workers > 1) {
      if (cluster.isMaster) {
        for (let i = 0; i < workers; i++) cluster.fork()

        return
      }

      /* no server fail at any cost ;) */
      process.on('uncaughtException', (err) => console.error(`Caught exception (worker pid: ${process.pid}): `, err))
        .on('unhandledRejection', (err) => console.warn(`Caught rejection (worker pid: ${process.pid}): `, err))

      http.createServer((req, res) => this._router.route(req, res))
        .listen(this.get('port'), this.get('url'), callback)

      return
    }

    /* no server fail at any cost ;) */
    process.on('uncaughtException', (err) => console.error('Caught exception: ', err))
      .on('unhandledRejection', (err) => console.warn('Caught rejection: ', err))

    http.createServer((req, res) => this._router.route(req, res))
      .listen(this.get('port'), this.get('url'), callback)
  }
}

export = Foxify
