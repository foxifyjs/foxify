import { MethodT } from "@foxify/http";
import Router from "../src";

it("should return the visual representation of tree nodes", () => {
  const router = (new Router);

  const routes = [
    {
      method: "GET",
      url   : "/user",
    },
    {
      method: "GET",
      url   : "/user/comments",
    },
    {
      method: "GET",
      url   : "/user/avatar",
    },
    {
      method: "GET",
      url   : "/user/lookup/username/:username",
    },
    {
      method: "GET",
      url   : "/user/lookup/email/:address",
    },
    {
      method: "GET",
      url   : "/event/:id",
    },
    {
      method: "GET",
      url   : "/event/:id/comments",
    },
    {
      method: "POST",
      url   : "/event/:id/comment",
    },
    {
      method: "GET",
      url   : "/map/:location/events",
    },
    {
      method: "GET",
      url   : "/status",
    },
    {
      method: "GET",
      url   : "/very/deeply/nested/route/hello/there",
    },
    {
      method: "GET",
      url   : "/static/*",
    },
  ];

  const handler = jest.fn();

  routes.forEach(({ method, url }) => router.on(method as MethodT, url, handler));

  expect(router.prettyPrint()).toBe(`\x1b[33m└── \x1b[0m/
\x1b[33m    \x1b[0m\x1b[33m├── \x1b[0mevent/
\x1b[33m    \x1b[0m\x1b[33m│   \x1b[0m\x1b[33m└── \x1b[0m:id \x1b[35m[\x1b[0m\x1b[36mGET\x1b[0m\x1b[35m]\x1b[0m
\x1b[33m    \x1b[0m\x1b[33m│   \x1b[0m\x1b[33m    \x1b[0m\x1b[33m└── \x1b[0m/comment \x1b[35m[\x1b[0m\x1b[36mPOST\x1b[0m\x1b[35m]\x1b[0m
\x1b[33m    \x1b[0m\x1b[33m│   \x1b[0m\x1b[33m    \x1b[0m\x1b[33m    \x1b[0m\x1b[33m└── \x1b[0ms \x1b[35m[\x1b[0m\x1b[36mGET\x1b[0m\x1b[35m]\x1b[0m
\x1b[33m    \x1b[0m\x1b[33m├── \x1b[0mmap/
\x1b[33m    \x1b[0m\x1b[33m│   \x1b[0m\x1b[33m└── \x1b[0m:location
\x1b[33m    \x1b[0m\x1b[33m│   \x1b[0m\x1b[33m    \x1b[0m\x1b[33m└── \x1b[0m/events \x1b[35m[\x1b[0m\x1b[36mGET\x1b[0m\x1b[35m]\x1b[0m
\x1b[33m    \x1b[0m\x1b[33m├── \x1b[0mstat
\x1b[33m    \x1b[0m\x1b[33m│   \x1b[0m\x1b[33m├── \x1b[0mic/
\x1b[33m    \x1b[0m\x1b[33m│   \x1b[0m\x1b[33m│   \x1b[0m\x1b[33m└── \x1b[0m* \x1b[35m[\x1b[0m\x1b[36mGET\x1b[0m\x1b[35m]\x1b[0m
\x1b[33m    \x1b[0m\x1b[33m│   \x1b[0m\x1b[33m└── \x1b[0mus \x1b[35m[\x1b[0m\x1b[36mGET\x1b[0m\x1b[35m]\x1b[0m
\x1b[33m    \x1b[0m\x1b[33m├── \x1b[0muser \x1b[35m[\x1b[0m\x1b[36mGET\x1b[0m\x1b[35m]\x1b[0m
\x1b[33m    \x1b[0m\x1b[33m│   \x1b[0m\x1b[33m└── \x1b[0m/
\x1b[33m    \x1b[0m\x1b[33m│   \x1b[0m\x1b[33m    \x1b[0m\x1b[33m├── \x1b[0mavatar \x1b[35m[\x1b[0m\x1b[36mGET\x1b[0m\x1b[35m]\x1b[0m
\x1b[33m    \x1b[0m\x1b[33m│   \x1b[0m\x1b[33m    \x1b[0m\x1b[33m├── \x1b[0mcomments \x1b[35m[\x1b[0m\x1b[36mGET\x1b[0m\x1b[35m]\x1b[0m
\x1b[33m    \x1b[0m\x1b[33m│   \x1b[0m\x1b[33m    \x1b[0m\x1b[33m└── \x1b[0mlookup/
\x1b[33m    \x1b[0m\x1b[33m│   \x1b[0m\x1b[33m    \x1b[0m\x1b[33m    \x1b[0m\x1b[33m├── \x1b[0memail/
\x1b[33m    \x1b[0m\x1b[33m│   \x1b[0m\x1b[33m    \x1b[0m\x1b[33m    \x1b[0m\x1b[33m│   \x1b[0m\x1b[33m└── \x1b[0m:address \x1b[35m[\x1b[0m\x1b[36mGET\x1b[0m\x1b[35m]\x1b[0m
\x1b[33m    \x1b[0m\x1b[33m│   \x1b[0m\x1b[33m    \x1b[0m\x1b[33m    \x1b[0m\x1b[33m└── \x1b[0musername/
\x1b[33m    \x1b[0m\x1b[33m│   \x1b[0m\x1b[33m    \x1b[0m\x1b[33m    \x1b[0m\x1b[33m    \x1b[0m\x1b[33m└── \x1b[0m:username \x1b[35m[\x1b[0m\x1b[36mGET\x1b[0m\x1b[35m]\x1b[0m
\x1b[33m    \x1b[0m\x1b[33m└── \x1b[0mvery/deeply/nested/route/hello/there \x1b[35m[\x1b[0m\x1b[36mGET\x1b[0m\x1b[35m]\x1b[0m`);
});
