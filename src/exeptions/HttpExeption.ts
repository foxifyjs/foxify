import { IncomingMessage, ServerResponse, STATUS_CODES } from 'http'
import { http } from '../constants'
import htmlError from './htmlError'

declare module HttpExeption { }

declare interface HttpExeption extends Error {
  code: number
  errors: object

  constructor(): this
  constructor(errors: object): this
  constructor(code: number, errors?: object): this
  constructor(message: string, errors: object): this
  constructor(message: string, code: number, errors?: object): this

  handle(exeption: any, req: IncomingMessage, res: ServerResponse): void
}

class HttpExeption extends Error {
  constructor(
    message: string | number | object = <string>STATUS_CODES[http.INTERNAL_SERVER_ERROR],
    code: number | object = http.INTERNAL_SERVER_ERROR,
    errors: object = {}) {
    if (Object.isInstance(message)) {
      errors = message
      code = http.INTERNAL_SERVER_ERROR
      message = STATUS_CODES[code] || `${code}`
    } else if (Number.isInstance(message)) {
      errors = <object>code || {}
      code = message
      message = STATUS_CODES[code] || `${code}`
    }

    if (Object.isInstance(code)) {
      errors = code
      code = http.INTERNAL_SERVER_ERROR
    }

    super(message)

    this.code = code
    this.errors = errors
  }

  static handle(exeption: any = new HttpExeption, req: IncomingMessage, res: ServerResponse): void {
    let message = exeption.message
    let errors = exeption.errors
    let code = exeption.code

    let html: string
    let json: Object

    switch (code) {
      case http.NOT_FOUND:
        message = message || STATUS_CODES[code]

        html = htmlError(code, message)
        json = { message }
        break
      case http.INTERNAL_SERVER_ERROR:
      default:
        code = http.INTERNAL_SERVER_ERROR
        message = message || STATUS_CODES[code]

        html = htmlError(code, message)
        json = { message, errors }
    }

    res.format({
      'text/html': () => res.status(code).send(html),
      'application/json': () => res.status(code).json(json),
      'default': () => res.status(code).send(message)
    })
  }
}

export = HttpExeption
