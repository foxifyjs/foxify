import foxifyInject, {
  DispatchT,
  InjectResultI,
  OptionsI,
} from "@foxify/inject";
import { Request, Response } from "../../src";

export default async function inject(
  dispatch: DispatchT<Request, Response>,
  options: OptionsI | string,
): Promise<InjectResultI<Request, Response>> {
  if (typeof options === "string") {
    options = {
      url: options,
    };
  }

  return foxifyInject<Request, Response>(
    (req, res) => {
      // Will be populated by foxify
      res.stringify = {};
      res.next = (err?): void => {
        if (err) throw err;
      };

      // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
      return dispatch(req, res);
    },

    // TODO: fix types
    {
      ...options,
      Request : Request as never,
      Response: Response as never,
    },
  );
}
