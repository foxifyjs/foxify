// tslint:disable-next-line:max-line-length
const template = "<!DOCTYPE html><html><head><title>Error&nbsp;{{code}}{{title}}</title><link rel='stylesheet' type='text/css' href='https://fonts.googleapis.com/css?family=Open+Sans'/><style>html,body{-webkit-touch-callout: none;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;font-family: Open Sans, Arial;font-size: 16px;line-height: 1.4;text-align: justify;background-color: #e74c3c;color: #fefefe;}html{display: flex; align-items: center; justify-content: center; height: 100vh;}body{display: flex; align-items: center; justify-content: center;margin: 2em auto;max-width: 800px;padding: 1em;}a{color: #07a}a:visited{color: #941352}@media screen and (max-width:500px){html,body{text-align: left}}</style></head><body><div><h1>Error&nbsp;{{code}}{{title}}</h1>{{message}}</div></body></html>";

export default (code: number, title?: string, message?: string) => template
  .replace(/{{code}}/g, `${code}`)
  .replace(/{{title}}/g, title ? ` - ${title}` : "")
  .replace(/{{message}}/g, message ? `<p>${message}</p>` : "");
