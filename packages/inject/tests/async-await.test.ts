import { IncomingMessage, ServerResponse } from "http";
import inject from "../src";

test("returns payload", async () => {
  expect.assertions(4);

  const output = "example.com:8080|/hello";

  const dispatch = (req: IncomingMessage, res: ServerResponse) => {
    res.statusMessage = "Super";
    res.setHeader("x-extra", "hello");
    res.writeHead(200, {
      "Content-Type": "text/plain",
      "Content-Length": output.length,
    });
    res.end(`${req.headers.host}|${req.url}`);
  };

  const result = await inject(dispatch, "http://example.com:8080/hello");

  expect(result.statusCode).toBe(200);
  expect(result.statusMessage).toBe("Super");
  expect(result.headers).toEqual({
    "content-length": output.length,
    "content-type": "text/plain",
    "x-extra": "hello",
  });
  expect(result.body).toBe(output);
});
