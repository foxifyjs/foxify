import * as http from 'http'
import { name } from '../../package.json'

const init = (req: http.IncomingMessage, res: http.ServerResponse, next: () => void) => {
  req.res = res
  res.req = req

  res.setHeader('X-Powered-By', name.capitalize())

  next()
}

export = init
