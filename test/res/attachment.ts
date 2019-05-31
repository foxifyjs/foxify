import * as Foxify from "../../src";

describe(".attachment()", () => {
  it("should Content-Disposition to attachment", async () => {
    expect.assertions(1);

    const app = new Foxify();

    app.use((req, res) => {
      res.attachment().send("foo");
    });

    const result = await app.inject("/");

    expect(result.headers["content-disposition"]).toBe("attachment");
  });
});

describe(".attachment(filename)", () => {
  it("should add the filename param", async () => {
    expect.assertions(1);

    const app = new Foxify();

    app.use((req, res) => {
      res.attachment("/path/to/image.png");
      res.send("foo");
    });

    const result = await app.inject("/");

    expect(result.headers["content-disposition"]).toBe(
      'attachment; filename="image.png"',
    );
  });

  it("should set the Content-Type", async () => {
    expect.assertions(1);

    const app = new Foxify();

    app.use((req, res) => {
      res.attachment("/path/to/image.png");
      res.send(Buffer.alloc(4, "."));
    });

    const result = await app.inject("/");

    expect(result.headers["content-type"]).toBe("image/png");
  });
});

describe(".attachment(utf8filename)", () => {
  it("should add the filename and filename* params", async () => {
    expect.assertions(2);

    const app = new Foxify();

    app.use((req, res) => {
      res.attachment("/locales/日本語.txt");
      res.send("japanese");
    });

    const result = await app.inject("/");

    expect(result.statusCode).toBe(200);
    expect(result.headers["content-disposition"]).toBe(
      "attachment; filename=\"???.txt\"; filename*=UTF-8''%E6%97%A5%E6%9C%AC%E8%AA%9E.txt",
    );
  });

  it("should set the Content-Type", async () => {
    expect.assertions(1);

    const app = new Foxify();

    app.use((req, res) => {
      res.attachment("/locales/日本語.txt");
      res.send("japanese");
    });

    const result = await app.inject("/");

    expect(result.headers["content-type"]).toBe("text/plain; charset=utf-8");
  });
});
