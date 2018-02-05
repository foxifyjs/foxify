import formidable from 'formidable'
import { Route } from './../routing'

export default class File {
  protected options: { [key: string]: any }

  constructor(options: { [key: string]: any } = {}) {
    this.options = {
      encoding: options.encoding,
      uploadDir: options.uploadDir,
      keepExtensions: options.keepExtensions
    }

    return this._files()
  }

  _files() {
    let route = new Route();

    route.oneOf(['POST', 'PUT'], '/:path*', (req, res, next) => {
      if (/^multipart\/form-data/.test(req.headers['content-type'])) {
        let form = new formidable.IncomingForm();

        for (let _key in this.options) {
          let _option = this.options[_key];

          if (_option !== undefined) {
            form[_key] = _option;
          }
        }

        return form.parse(req, (err, fields, files) => {
          if (err) {
            return res.json({ message: 'Internal Server Error' }, 500);
          }

          req.files = files || {};

          next();
        });
      }

      req.files = {}

      next()
    })

    return route
  }
}
