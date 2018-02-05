import * as http from 'http'
import * as url from 'url'

declare module "http" {
  export interface IncomingMessage {
    params: any
  }
}

export default (req: http.IncomingMessage, res: http.ServerResponse, next: () => void) => {
  let _params

  let _url = url.parse(req.url || '', true)

  _params = _url.query || {}

  req.params = _params

  next()
}
