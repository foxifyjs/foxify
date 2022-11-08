export const routes = [
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

// eslint-disable-next-line @typescript-eslint/no-empty-function
export function noop(): void {}
