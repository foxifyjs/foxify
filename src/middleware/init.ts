import * as http from 'http'
import * as Fox from '../index'
import { name } from '../../package.json'

const init = (app: Fox) => {
  if (app.enabled('x-powered-by')) {
    return (req: http.IncomingMessage, res: http.ServerResponse, next: () => void) => {
      req.res = res
      res.req = req

      res.setHeader('X-Powered-By', name.capitalize())

      next()
    }
  }

  return (req: http.IncomingMessage, res: http.ServerResponse, next: () => void) => {
    req.res = res
    res.req = req

    next()
  }
}

export = init
