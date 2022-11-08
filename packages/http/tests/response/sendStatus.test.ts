import { inject, reset } from "../__internals__";

afterEach(reset);

describe(".sendStatus(statusCode)", () => {
  it("should send the status code and message as body", async () => {
    expect.assertions(2);

    const result = await inject((req, res) => res.sendStatus(201), "/");

    expect(result.statusCode).toBe(201);
    expect(result.body).toBe("Created");
  });

  it("should work with unknown code", async () => {
    expect.assertions(2);

    const result = await inject((req, res) => res.sendStatus(599 as any), "/");

    expect(result.statusCode).toBe(599);
    expect(result.body).toBe("599");
  });
});
