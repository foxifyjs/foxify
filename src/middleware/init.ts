import * as http from 'http'
import setPrototypeOf = require('setprototypeof')
import { request, response } from '../prototypes'
import { Engine } from '../view'
import * as Fox from '../Fox'
import { name } from '../../package.json'

const init = (fox: Fox) => (req: http.IncomingMessage, res: http.ServerResponse, next: () => void) => {
  setPrototypeOf(req, request)
  
  setPrototypeOf(response, Engine.responsePrototype(<Engine>fox.view))
  setPrototypeOf(res, response)

  req.res = res
  res.req = req

  res.setHeader('X-Powered-By', name.capitalize())

  next()
}

export = init
