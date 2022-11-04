import Foxify from "../../src";

it("should set the header", async () => {
  expect.assertions(2);

  const app = (new Foxify);

  app.get("/", (req, res) => {
    res.location("http://google.com").end();
  });

  const result = await app.inject("/");

  expect(result.statusCode).toBe(200);
  expect(result.headers.location).toBe("http://google.com");
});

it('should encode "url"', async () => {
  expect.assertions(2);

  const app = (new Foxify);

  app.get("/", (req, res) => {
    res.location("https://google.com?q=\u2603 §10").end();
  });

  const result = await app.inject("/");

  expect(result.statusCode).toBe(200);
  expect(result.headers.location).toBe("https://google.com?q=%E2%98%83%20%C2%A710");
});

it('should not touch already-encoded sequences in "url"', async () => {
  expect.assertions(2);

  const app = (new Foxify);

  app.get("/", (req, res) => {
    res.location("https://google.com?q=%A710").end();
  });

  const result = await app.inject("/");

  expect(result.statusCode).toBe(200);
  expect(result.headers.location).toBe("https://google.com?q=%A710");
});

describe('when url is "back"', () => {
  it('should set location from "Referer" header', async () => {
    expect.assertions(2);

    const app = (new Foxify);

    app.get("/", (req, res) => {
      res.location("back").end();
    });

    const result = await app.inject({
      url    : "/",
      headers: {
        referer: "/some/page.html",
      },
    });

    expect(result.statusCode).toBe(200);
    expect(result.headers.location).toBe("/some/page.html");
  });

  it('should set location from "Referrer" header', async () => {
    expect.assertions(2);

    const app = (new Foxify);

    app.get("/", (req, res) => {
      res.location("back").end();
    });

    const result = await app.inject({
      url    : "/",
      headers: {
        referrer: "/some/page.html",
      },
    });

    expect(result.statusCode).toBe(200);
    expect(result.headers.location).toBe("/some/page.html");
  });

  it('should prefer "Referrer" header', async () => {
    expect.assertions(2);

    const app = (new Foxify);

    app.get("/", (req, res) => {
      res.location("back").end();
    });

    const result = await app.inject({
      url    : "/",
      headers: {
        referer : "/some/page1.html",
        referrer: "/some/page2.html",
      },
    });

    expect(result.statusCode).toBe(200);
    expect(result.headers.location).toBe("/some/page2.html");
  });

  it('should set the header to "/" without referrer', async () => {
    expect.assertions(2);

    const app = (new Foxify);

    app.get("/", (req, res) => {
      res.location("back").end();
    });

    const result = await app.inject("/");

    expect(result.statusCode).toBe(200);
    expect(result.headers.location).toBe("/");
  });
});
