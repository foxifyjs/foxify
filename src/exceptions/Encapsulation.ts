import { http } from "../constants";
import events from "../events";
import * as Request from "../Request";
import * as Response from "../Response";

const handle = (error: any, req: Request, res: Response) => {
  events.emit(
    `error-${error.code || http.INTERNAL_SERVER_ERROR}` as any,
    error,
    req,
    res,
  );

  // if (process.env.NODE_ENV === "development") console.error("Encapsulation: ", error);
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
