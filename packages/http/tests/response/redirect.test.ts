import { inject, reset } from "../__internals__";

afterEach(reset);

describe(".redirect(url)", () => {
  it("should default to a 302 redirect", async () => {
    expect.assertions(2);

    const result = await inject(
      (req, res) => res.redirect("http://google.com"),
      "/",
    );

    expect(result.statusCode).toBe(302);
    expect(result.headers.location).toBe("http://google.com");
  });

  it('should encode "url"', async () => {
    expect.assertions(2);

    const result = await inject(
      (req, res) => res.redirect("https://google.com?q=\u2603 §10"),
      "/",
    );

    expect(result.statusCode).toBe(302);
    expect(result.headers.location).toBe("https://google.com?q=%E2%98%83%20%C2%A710");
  });

  it('should not touch already-encoded sequences in "url"', async () => {
    expect.assertions(2);

    const result = await inject(
      (req, res) => res.redirect("https://google.com?q=%A710"),
      "/",
    );

    expect(result.statusCode).toBe(302);
    expect(result.headers.location).toBe("https://google.com?q=%A710");
  });
});

describe(".redirect(url, status)", () => {
  it("should set the response status", async () => {
    expect.assertions(2);

    const result = await inject(
      (req, res) => res.redirect("http://google.com", 303),
      "/",
    );

    expect(result.statusCode).toBe(303);
    expect(result.headers.location).toBe("http://google.com");
  });
});

describe("when the request method is HEAD", () => {
  it("should ignore the body", async () => {
    expect.assertions(3);

    const result = await inject(
      (req, res) => res.redirect("http://google.com"),
      {
        url   : "/",
        method: "HEAD",
      },
    );

    expect(result.statusCode).toBe(302);
    expect(result.headers.location).toBe("http://google.com");
    expect(result.body).toBe("");
  });
});

describe("when accepting html", () => {
  it("should respond with html", async () => {
    expect.assertions(4);

    const result = await inject(
      (req, res) => res.redirect("http://google.com"),
      {
        url    : "/",
        headers: {
          accept: "text/html",
        },
      },
    );

    expect(result.statusCode).toBe(302);
    expect(result.headers["content-type"]).toMatch(/html/);
    expect(result.headers.location).toBe("http://google.com");
    expect(result.body).toBe('<p>Found. Redirecting to <a href="http://google.com">http://google.com</a></p>');
  });

  it("should escape the url", async () => {
    expect.assertions(4);

    const result = await inject((req, res) => res.redirect("<la'me>"), {
      url    : "/",
      headers: {
        host  : "http://example.com",
        accept: "text/html",
      },
    });

    expect(result.statusCode).toBe(302);
    expect(result.headers["content-type"]).toMatch(/html/);
    expect(result.headers.location).toBe("%3Cla'me%3E");
    expect(result.body).toBe('<p>Found. Redirecting to <a href="%3Cla&#39;me%3E">%3Cla&#39;me%3E</a></p>');
  });

  it("should include the redirect type", async () => {
    expect.assertions(4);

    const result = await inject(
      (req, res) => res.redirect("http://google.com", 301),
      {
        url    : "/",
        headers: {
          accept: "text/html",
        },
      },
    );

    expect(result.statusCode).toBe(301);
    expect(result.headers["content-type"]).toMatch(/html/);
    expect(result.headers.location).toBe("http://google.com");
    expect(result.body).toBe('<p>Moved Permanently. Redirecting to <a href="http://google.com">http://google.com</a></p>');
  });
});

describe("when accepting text", () => {
  it("should respond with text", async () => {
    expect.assertions(4);

    const result = await inject(
      (req, res) => res.redirect("http://google.com"),
      {
        url    : "/",
        headers: {
          accept: "text/plain, */*",
        },
      },
    );

    expect(result.statusCode).toBe(302);
    expect(result.headers["content-type"]).toMatch(/plain/);
    expect(result.headers.location).toBe("http://google.com");
    expect(result.body).toBe("Found. Redirecting to http://google.com");
  });

  it("should encode the url", async () => {
    expect.assertions(4);

    const result = await inject(
      (req, res) => res.redirect('http://example.com/?param=<script>alert("hax");</script>'),
      {
        url    : "/",
        headers: {
          host  : "http://example.com",
          accept: "text/plain, */*",
        },
      },
    );

    expect(result.statusCode).toBe(302);
    expect(result.headers["content-type"]).toMatch(/plain/);
    expect(result.headers.location).toBe("http://example.com/?param=%3Cscript%3Ealert(%22hax%22);%3C/script%3E");
    expect(result.body).toBe("Found. Redirecting to http://example.com/?param=%3Cscript%3Ealert(%22hax%22);%3C/script%3E");
  });

  it("should include the redirect type", async () => {
    expect.assertions(4);

    const result = await inject(
      (req, res) => res.redirect("http://google.com", 301),
      {
        url    : "/",
        headers: {
          accept: "text/plain, */*",
        },
      },
    );

    expect(result.statusCode).toBe(301);
    expect(result.headers["content-type"]).toMatch(/plain/);
    expect(result.headers.location).toBe("http://google.com");
    expect(result.body).toBe("Moved Permanently. Redirecting to http://google.com");
  });
});

describe("when accepting neither text or html", () => {
  it("should respond with an empty body", async () => {
    expect.assertions(5);

    const result = await inject(
      (req, res) => res.redirect("http://google.com"),
      {
        url    : "/",
        headers: {
          accept: "application/octet-stream",
        },
      },
    );

    expect(result.statusCode).toBe(302);
    expect(result.headers.location).toBe("http://google.com");
    expect(result.headers["content-length"]).toBe("0");
    expect(result.headers["content-type"]).toBeUndefined();
    expect(result.body).toBe("");
  });
});
