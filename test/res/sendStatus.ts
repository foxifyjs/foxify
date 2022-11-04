import Foxify from "../../src";

describe(".sendStatus(statusCode)", () => {
  it("should send the status code and message as body", async () => {
    expect.assertions(2);

    const app = (new Foxify);

    app.get("/", (req, res) => {
      res.sendStatus(201);
    });

    const result = await app.inject("/");

    expect(result.statusCode).toBe(201);
    expect(result.body).toBe("Created");
  });

  it("should work with unknown code", async () => {
    expect.assertions(2);

    const app = (new Foxify);

    app.get("/", (req, res) => {
      res.sendStatus(599 as any);
    });

    const result = await app.inject("/");

    expect(result.statusCode).toBe(599);
    expect(result.body).toBe("599");
  });
});
