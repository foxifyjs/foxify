import { inject, reset } from "../__internals__";

afterEach(reset);

it("should return true when X-Requested-With is xmlhttprequest", async () => {
  expect.assertions(2);

  const result = await inject((req, res) => res.end(JSON.stringify(req.xhr)), {
    url    : "/",
    headers: {
      "x-requested-with": "xmlhttprequest",
    },
  });

  expect(result.statusCode).toBe(200);
  expect(result.body).toBe("true");
});

it("should case-insensitive", async () => {
  expect.assertions(2);

  const result = await inject((req, res) => res.end(JSON.stringify(req.xhr)), {
    url    : "/",
    headers: {
      "x-requested-with": "XMLHttpRequest",
    },
  });

  expect(result.statusCode).toBe(200);
  expect(result.body).toBe("true");
});

it("should return false otherwise", async () => {
  expect.assertions(2);

  const result = await inject((req, res) => res.end(JSON.stringify(req.xhr)), {
    url    : "/",
    headers: {
      "x-requested-with": "blahblah",
    },
  });

  expect(result.statusCode).toBe(200);
  expect(result.body).toBe("false");
});

it("should return false when not present", async () => {
  expect.assertions(2);

  const result = await inject(
    (req, res) => res.end(JSON.stringify(req.xhr)),
    "/",
  );

  expect(result.statusCode).toBe(200);
  expect(result.body).toBe("false");
});
