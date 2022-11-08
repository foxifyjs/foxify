import { inject, reset } from "../__internals__";

afterEach(reset);

it("should set Link header field", async () => {
  expect.assertions(2);

  const result = await inject((req, res) => {
    res.links({
      next: "http://api.example.com/users?page=2",
      last: "http://api.example.com/users?page=5",
    });

    res.end();
  }, "/");

  expect(result.statusCode).toBe(200);
  expect(result.headers.link).toBe('<http://api.example.com/users?page=2>; rel="next", <http://api.example.com/users?page=5>; rel="last"');
});

it("should set Link header field for multiple calls", async () => {
  expect.assertions(2);

  const result = await inject((req, res) => {
    res.links({
      next: "http://api.example.com/users?page=2",
      last: "http://api.example.com/users?page=5",
    });

    res.links({
      prev: "http://api.example.com/users?page=1",
    });

    res.end();
  }, "/");

  expect(result.statusCode).toBe(200);
  expect(result.headers.link).toBe('<http://api.example.com/users?page=2>; rel="next", <http://api.example.com/users?page=5>; rel="last", <http://api.example.com/users?page=1>; rel="prev"');
});
