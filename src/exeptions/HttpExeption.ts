import { IncomingMessage, ServerResponse, STATUS_CODES } from 'http'
import { http } from '../constants'

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

  static handle(exeption: any = new HttpExeption(http.INTERNAL_SERVER_ERROR), req: IncomingMessage, res: ServerResponse): void {
    let message = exeption.message
    let errors = exeption.errors
    let code = exeption.code

    let html
    let json
    let def

    switch (code) {
      case http.NOT_FOUND:
        message = message || STATUS_CODES[code]
        html = () => res.status(code).send(`<p>${message}</p>`)
        json = () => res.status(code).json({ message })
        def = () => res.status(code).send(message)
        break
      case http.INTERNAL_SERVER_ERROR:
      default:
        code = http.INTERNAL_SERVER_ERROR
        message = message || STATUS_CODES[code]
        html = () => res.status(code).send(`<p>${message}</p>`)
        json = () => res.status(code).json({ message, errors })
        def = () => res.status(code).send(message)
    }

    res.format({
      'text/html': html,
      'application/json': json,
      'default': def
    })
  }
}

export = HttpExeption
