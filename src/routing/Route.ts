import * as http from 'http'
import { Encapsulation } from '../exeptions'
import httpMethods from './httpMethods'

declare module Route {
  export interface Controller {
    (requset: http.IncomingMessage, response: http.ServerResponse, next: () => void, ...rest: Array<any>): void
  }

  export interface Routes {
    [method: string]: Array<RouteObject>
  }

  export interface RouteObject {
    path: string | RegExp,
    controller: Encapsulation
  }
}

declare interface Route {
  [key: string]: any
}

/**
 *
 */
class Route {
  public routes: Route.Routes = {}

  protected _prefix: string

  /**
   *
   * @param {String?} prefix
   */
  constructor(prefix: string = '') {
    this._prefix = prefix

    httpMethods.map((method) => {
      this.routes[method] = []

      this[method.toLowerCase()] = (path: string, controller: Route.Controller) => this._push(method, path, controller)
    })
  }

  /**
   *
   * @param {!String} method
   * @param {!String} path
   * @param {!Function} controller
   * @private
   */
  protected _push(method: string, path: string, controller: Route.Controller) {
    path = `${this._prefix}${path}`.replace(/\/$/, '')

    this.routes[method].push({
      path,
      controller: new Encapsulation((req, res, next: () => void, ...args: Array<any>) => controller(req, res, next, ...args))
    })
  }

  /**
   *
   * @param {!String} path
   * @param {!Function} controller
   */
  any(path: string, controller: Route.Controller) {
    httpMethods.map((method) => this._push(method, path, controller))
  }

  /**
   *
   * @param {!(String[])} methods
   * @param {!String} path
   * @param {!Function} controller
   */
  oneOf(methods: Array<string>, path: string, controller: Route.Controller) {
    methods.map((method) => this._push(method.toUpperCase(), path, controller))
  }

  /**
   *
   * @param {Function|String|Route} [first=(function())]
   * @param {Function} [second=(function())]
   */
  use(first: Route.Controller | string | Route = () => { }, second: Route.Controller = () => { }) {
    if (first instanceof Route) {
      let _routes = first.routes

      httpMethods.map((method) => this._routes[method].push(..._routes[method]))
    } else {
      let _path = '(.*)'
      let _middleware = first

      if (String.isInstance(first)) {
        _path = `${first}${_path}`
        _middleware = second
      }

      this.any(_path, <Route.Controller>_middleware)
    }
  }
}

export = Route
