// tslint:disable:max-line-length
export default (
  statusCode: number,
  title?: string,
  message?: string,
  stack?: string,
) =>
  `<!DOCTYPE html><html><head><title>Error&nbsp;${statusCode}&nbsp;-&nbsp;${title}</title><link rel='stylesheet' type='text/css' href='https://fonts.googleapis.com/css?family=Open+Sans'/><style>html,body{-webkit-touch-callout:none;${
    stack
      ? ""
      : "-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;"
  }font-family:Open Sans,Arial;font-size:16px;line-height:1.4;background-color:#e74c3c;color:#fefefe;}html{display:flex;align-items:center;justify-content:center;height:100vh;}body{display:flex;align-items:center;justify-content:center;margin:2em auto;max-width:800px;padding:1em;}a{color:#07a}a:visited{color:#941352}@media screen and (max-width:500px){html,body{text-align:left}}</style></head><body><div><h1>Error&nbsp;${statusCode}&nbsp;-&nbsp;${title}</h1><p>${message}</p>${
    stack ? `<p>${stack}</p>` : ""
  }</div></body></html>`;
