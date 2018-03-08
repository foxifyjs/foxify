import * as http from 'http'
import * as parseUrl from 'parseurl'
import * as qs from 'qs'
import * as Fox from '../index'

const query = (app: Fox) => {
  let queryparse: Function = app.get('query.parser') || qs.parse

  return (req: http.IncomingMessage, res: http.ServerResponse, next: () => void) => {
    req.query = req.query || queryparse((parseUrl(req) as any).query, {})

    next()
  }
}

export = query
