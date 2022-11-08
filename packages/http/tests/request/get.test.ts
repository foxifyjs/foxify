import { DispatchT } from "@foxify/inject";
import { Request, Response } from "../../src";
import { inject, reset } from "../__internals__";

afterEach(reset);

it("should return the header field value", async () => {
  expect.assertions(2);

  const result = await inject(
    (req, res) => {
      expect(req.get("Something-Else")).toBeUndefined();

      res.end(req.get("Content-Type"));
    },
    {
      url    : "/",
      headers: {
        "content-type": "application/json",
      },
    },
  );

  expect(result.body).toBe("application/json");
});

it("should special-case Referer", async () => {
  expect.assertions(2);

  const dispatch: DispatchT<Request, Response> = (req, res) => res.end(req.get("Referer"));

  const referer = "https://foxify.js.org";

  let result = await inject(dispatch, {
    url    : "/",
    headers: {
      referer,
    },
  });

  expect(result.body).toBe(referer);

  result = await inject(dispatch, {
    url    : "/",
    headers: {
      referrer: referer,
    },
  });

  expect(result.body).toBe(referer);
});

it("should special-case Referrer", async () => {
  expect.assertions(2);

  const dispatch: DispatchT<Request, Response> = (req, res) => res.end(req.get("Referrer"));

  const referer = "https://foxify.js.org";

  let result = await inject(dispatch, {
    url    : "/",
    headers: {
      referer,
    },
  });

  expect(result.body).toBe(referer);

  result = await inject(dispatch, {
    url    : "/",
    headers: {
      referrer: referer,
    },
  });

  expect(result.body).toBe(referer);
});
