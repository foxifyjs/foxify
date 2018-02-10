import * as http from 'http'
import * as parseUrl from 'parseurl'
import * as qs from 'qs'

const query = (options: Object | Function = {}) => {
  let opts: OBJ | undefined = Object.assign({}, options)
  let queryparse = qs.parse

  if (Function.isInstance(options)) {
    queryparse = <(str: string, options?: qs.IParseOptions) => any>options
    opts = {}
  }

  return (req: http.IncomingMessage, res: http.ServerResponse, next: () => void) => {
    req.query = req.query || queryparse((parseUrl(req) as any).query, opts)

    next()
  }
}

export = query
