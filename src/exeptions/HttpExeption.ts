import { IncomingMessage, ServerResponse, STATUS_CODES } from 'http'
import { http } from '../constants'

declare module HttpExeption { }

declare interface HttpExeption extends Error {
  code: number
  errors: object

  handle(exeption: any, req: IncomingMessage, res: ServerResponse): void
}

class HttpExeption extends Error {
  constructor(message: string, code: number = http.INTERNAL_SERVER_ERROR, errors: object = {}) {
    super(message)

    this.code = code
    this.errors = errors
  }

  static handle(exeption: any, req: IncomingMessage, res: ServerResponse): void {
    if (!exeption) {
      res.status(http.INTERNAL_SERVER_ERROR)
        .json({ message: STATUS_CODES[http.INTERNAL_SERVER_ERROR] })

      return
    }

    switch (exeption.code) {
      case http.NOT_FOUND:
        res.status(http.NOT_FOUND)
          .json({ message: exeption.message || STATUS_CODES[http.NOT_FOUND] })
        break
      case http.INTERNAL_SERVER_ERROR:
      default:
        res.status(http.INTERNAL_SERVER_ERROR)
          .json({ message: exeption.message || STATUS_CODES[http.INTERNAL_SERVER_ERROR] })
    }
  }
}

export = HttpExeption
