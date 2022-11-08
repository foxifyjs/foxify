import { inject, reset } from "../__internals__";

afterEach(reset);

describe(".download(path)", () => {
  it("should transfer as an attachment", async () => {
    expect.assertions(4);

    const result = await inject(
      (req, res) => res.download("tests/__internals__/fixtures/user.html"),
      "/",
    );

    expect(result.statusCode).toBe(200);
    expect(result.headers["content-type"]).toBe("text/html; charset=UTF-8");
    expect(result.headers["content-disposition"]).toBe('attachment; filename="user.html"');
    expect(result.body).toBe("<p>{{user.name}}</p>");
  });
});

describe(".download(path, filename)", () => {
  it("should provide an alternate filename", async () => {
    expect.assertions(4);

    const result = await inject(
      (req, res) => res.download("tests/__internals__/fixtures/user.html", "document"),
      "/",
    );

    expect(result.statusCode).toBe(200);
    expect(result.headers["content-type"]).toBe("text/html; charset=UTF-8");
    expect(result.headers["content-disposition"]).toBe('attachment; filename="document"');
    expect(result.body).toBe("<p>{{user.name}}</p>");
  });
});

describe(".download(path, fn)", () => {
  it("should invoke the callback", async () => {
    expect.assertions(5);

    const cb = jest.fn();

    const result = await inject(
      (req, res) => res.download("tests/__internals__/fixtures/user.html", cb),
      "/",
    );

    expect(cb).toBeCalledTimes(1);
    expect(result.statusCode).toBe(200);
    expect(result.headers["content-type"]).toBe("text/html; charset=UTF-8");
    expect(result.headers["content-disposition"]).toBe('attachment; filename="user.html"');
    expect(result.body).toBe("<p>{{user.name}}</p>");
  });
});

describe(".download(path, filename, fn)", () => {
  it("should invoke the callback", async () => {
    expect.assertions(5);

    const cb = jest.fn();

    const result = await inject(
      (req, res) => res.download(
        "tests/__internals__/fixtures/user.html",
        "document",
        cb,
      ),
      "/",
    );

    expect(cb).toBeCalledTimes(1);
    expect(result.statusCode).toBe(200);
    expect(result.headers["content-type"]).toBe("text/html; charset=UTF-8");
    expect(result.headers["content-disposition"]).toBe('attachment; filename="document"');
    expect(result.body).toBe("<p>{{user.name}}</p>");
  });
});

describe(".download(path, filename, options, fn)", () => {
  it("should invoke the callback", async () => {
    expect.assertions(5);

    const cb = jest.fn();
    const options = {};

    const result = await inject(
      (req, res) => res.download(
        "tests/__internals__/fixtures/user.html",
        "document",
        options,
        cb,
      ),
      "/",
    );

    expect(cb).toBeCalledTimes(1);
    expect(result.statusCode).toBe(200);
    expect(result.headers["content-type"]).toBe("text/html; charset=UTF-8");
    expect(result.headers["content-disposition"]).toBe('attachment; filename="document"');
    expect(result.body).toBe("<p>{{user.name}}</p>");
  });

  it("should allow options to res.sendFile()", async () => {
    expect.assertions(4);

    const result = await inject(
      (req, res) => res.download("tests/__internals__/fixtures/.name", "document", {
        dotfiles: "allow",
        maxAge  : "4h",
      }),
      "/",
    );

    expect(result.statusCode).toBe(200);
    expect(result.headers["cache-control"]).toBe("public, max-age=14400");
    expect(result.headers["content-disposition"]).toBe('attachment; filename="document"');
    expect(result.body).toEqual("tobi");
  });

  describe("when options.headers contains Content-Disposition", () => {
    it("should be ignored", async () => {
      expect.assertions(4);

      const result = await inject(
        (req, res) => res.download(
          "tests/__internals__/fixtures/user.html",
          "document",
          {
            headers: {
              "Content-Type"       : "text/x-custom",
              "Content-Disposition": "inline",
            },
          },
        ),
        "/",
      );

      expect(result.statusCode).toBe(200);
      expect(result.headers["content-type"]).toBe("text/x-custom");
      expect(result.headers["content-disposition"]).toBe('attachment; filename="document"');
      expect(result.body).toEqual("<p>{{user.name}}</p>");
    });

    it("should be ignored case-insensitively", async () => {
      expect.assertions(4);

      const result = await inject(
        (req, res) => res.download(
          "tests/__internals__/fixtures/user.html",
          "document",
          {
            headers: {
              "content-type"       : "text/x-custom",
              "content-disposition": "inline",
            },
          },
        ),
        "/",
      );

      expect(result.statusCode).toBe(200);
      expect(result.headers["content-type"]).toBe("text/x-custom");
      expect(result.headers["content-disposition"]).toBe('attachment; filename="document"');
      expect(result.body).toEqual("<p>{{user.name}}</p>");
    });
  });
});

describe("on failure", () => {
  it("should invoke the callback", async () => {
    expect.assertions(2);

    const result = await inject(
      (req, res) => res.download("tests/__internals__/fixtures/foobar.html", (err) => {
        if (!err) throw new Error("expected error");

        res.send(`got ${ err.status }`);
      }),
      "/",
    );

    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual("got 404");
  });

  it("should remove Content-Disposition", async () => {
    expect.assertions(3);

    const result = await inject(
      (req, res) => res.download("tests/__internals__/fixtures/foobar.html", (err) => {
        if (!err) throw new Error("expected error");

        res.end("failed");
      }),
      "/",
    );

    expect(result.statusCode).toBe(200);
    expect(result.headers["content-disposition"]).toBeFalsy();
    expect(result.body).toEqual("failed");
  });
});
