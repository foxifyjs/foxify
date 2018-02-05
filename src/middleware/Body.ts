import anyBody from 'body/any'
import {Route} from './../routing'

export default class Body {
  constructor() {
    return this._any()
  }

  _any() {
    let route = new Route();

    route.oneOf(['POST', 'PUT'], '/:path*', (req, res, next) => {
      return anyBody(req, (err, body) => {
        if (err && !/^multipart\/form-data/.test(err.contentType)) {
          return res.json({message: 'Internal Server Error', err}, 500);
        }

        req.body = body || {};

        return next();
      });
    });

    return route;
  }
}
