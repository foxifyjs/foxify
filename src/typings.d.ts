declare module "*/package.json" {
  const package: {
    name: string
    version: string
  }

  export = package
}

declare module "*.json" {
  type OBJECT = { [key: string]: any }
  type JSON = OBJECT | OBJECT[]

  const json: JSON

  export = json
}

declare module "encodeurl"
declare module "serve-static"
