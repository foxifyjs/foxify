import { IncomingMessage, ServerResponse } from 'http'
import { HttpExeption } from '../exeptions'
import httpMethods from './httpMethods'
import * as constants from '../constants'
import * as Route from './Route'

declare module Router { }

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
        let next = () => this._next(req, res, url, routes, i + 1)

        req.next = next

        let result

        try {
          result = route.controller(req, res, next, ...params.tail())
        } catch (err) {
          // in case of sync function errors
          HttpExeption.handle(err, req, res)
        }

        // in case of promise errors
        if (result && Function.isInstance((result as any).then)) (result as any).catch((err: Error) => HttpExeption.handle(err, req, res))

        return
      }
    }

    HttpExeption.handle(new HttpExeption('Not Found', constants.http.NOT_FOUND), req, res)
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

export = Router
