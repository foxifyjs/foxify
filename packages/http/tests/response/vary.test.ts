import { inject, reset } from "../__internals__";

afterEach(reset);

describe("with no arguments", () => {
  it("should not set Vary", async () => {
    expect.assertions(2);

    const result = await inject((req, res) => res.vary().end(), "/");

    expect(result.statusCode).toBe(200);
    expect(result.headers.vary).toBeUndefined();
  });
});

describe("with an empty array", () => {
  it("should not set Vary", async () => {
    expect.assertions(2);

    const result = await inject((req, res) => res.vary([]).end(), "/");

    expect(result.statusCode).toBe(200);
    expect(result.headers.vary).toBeUndefined();
  });
});

describe("with an array", () => {
  it("should set the values", async () => {
    expect.assertions(2);

    const result = await inject(
      (req, res) => res.vary(["Accept", "Accept-Language", "Accept-Encoding"]).end(),
      "/",
    );

    expect(result.statusCode).toBe(200);
    expect(result.headers.vary).toBe("Accept, Accept-Language, Accept-Encoding");
  });
});

describe("with a string", () => {
  it("should set the value", async () => {
    expect.assertions(2);

    const result = await inject((req, res) => res.vary("Accept").end(), "/");

    expect(result.statusCode).toBe(200);
    expect(result.headers.vary).toBe("Accept");
  });
});

describe("when the value is present", () => {
  it("should not add it again", async () => {
    expect.assertions(2);

    const result = await inject(
      (req, res) => res
        .vary("Accept")
        .vary("Accept-Encoding")
        .vary("Accept-Encoding")
        .vary("Accept-Encoding")
        .vary("Accept")
        .end(),
      "/",
    );

    expect(result.statusCode).toBe(200);
    expect(result.headers.vary).toBe("Accept, Accept-Encoding");
  });
});
