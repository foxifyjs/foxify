import './bootstrap'
import * as http from 'http'
import setPrototypeOf = require('setprototypeof')
import { request, response } from './prototypes'
import { Router, Route } from './routing'
import * as db from './database'

declare module Fox {
}

class Fox {
  protected _router = new Router()

  static db = db

  /**
   *
   * @param {Function|String|Route} [first=(function())]
   * @param {Function} [second=(function())]
   */
  use(first: Route.Controller | string | Route = () => { }, second: Route.Controller = () => { }) {
    if (first instanceof Route) {
      this._router.push(first.routes)
    } else {
      let route = new Route()

      route.use(first, second)

      this._router.push(route.routes)
    }
  }

  /**
   * start the server
   */
  start() {
    let server = http.createServer((req, res) => {
      try {
        setPrototypeOf(req, request)
        setPrototypeOf(res, response)

        res.setHeader('X-Powered-By', 'Fox')

        this._router.route(req, res)
      } catch (err) {
        HttpExeption.handle(err, req, res)
      }
    })

    server.listen(
      +(process.env.APP_PORT || '3000'),
      process.env.APP_URL,
      () => console.log(`Fox server running at http://${process.env.APP_URL}:${process.env.APP_PORT}`)
    )
  }
}

export = Fox
