import { http } from "../constants";
import events from "../events";
import Request from "../Request";
import Response from "../Response";

const handle = (error: any, req: Request, res: Response) => {
  let code = error.code;

  switch (code) {
    case "ERR_ASSERTION":
    case undefined:
    case null:
      code = error.code = http.INTERNAL_SERVER_ERROR;
  }

  events.emit(`error-${code}` as any, error, req, res);

  // tslint:disable-next-line:no-console
  // if (process.env.NODE_ENV === "development") console.error(error);
};

class Encapsulation {
  protected _fn: (req: Request, res: Response, ...rest: any[]) => any;

  constructor(fn: (req: Request, res: Response, ...rest: any[]) => any) {
    this._fn = fn;
  }

  public run(req: Request, res: Response, ...rest: any[]) {
    try {
      const result = this._fn(req, res, ...rest);

      if (result instanceof Promise) result.catch(err => handle(err, req, res));
    } catch (err) {
      handle(err, req, res);
    }
  }
}

export default Encapsulation;
