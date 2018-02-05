import { IncomingMessage, ServerResponse } from 'http'
import { HttpExeption } from '../exeptions'
import httpMethods from './httpMethods'
import constants from '../constants'
import Route from './Route'

class Router {
  protected _routes: Route.Routes = {}

  constructor() {
    httpMethods.map((method) => this._routes[method] = [])
  }

  protected _next(req: IncomingMessage, res: ServerResponse, url: string, routes: Array<Route.RouteObject>, index = 0) {
    for (let i = index; i < routes.length; i++) {
      let route = routes[i]

      let params = route.path.exec(url)

      if (params) {
        route.controller(req, res, () => this._next(req, res, url, routes, i + 1), ...params.tail())

        return
      }
    }

    throw new HttpExeption('Not Found', constants.http.NOT_FOUND)
  }

  push(routes: Route.Routes) {
    httpMethods.map((method) => this._routes[method].push(...routes[method]))
  }

  route(req: IncomingMessage, res: ServerResponse) {
    if (!req.url) {
      throw new HttpExeption('Bad Request', constants.http.BAD_REQUEST, {
        url: {
          message: 'Request url is not defined'
        }
      })
    }

    if (!req.method) {
      throw new HttpExeption('Bad Request', constants.http.BAD_REQUEST, {
        method: {
          message: 'Request method is not defined'
        }
      })
    }

    this._next(req, res, req.url.split('?').first(), this._routes[req.method])
  }
}

export default Router
