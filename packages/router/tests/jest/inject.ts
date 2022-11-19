import { Request, Response } from "@foxify/http";
import foxifyInject, { InjectResultI, OptionsI } from "@foxify/inject";
import Router from "#src/index";

export default async function inject(
  router: Router,
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

      router.lookup(req, res);
    },

    // TODO: Fix type issue
    {
      ...options,
      Request : Request as never,
      Response: Response as never,
    },
  );
}
