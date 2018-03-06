declare module "*/package.json" {
  const package: {
    name: string
    version: string
  }

  export = package
}

declare module "*.json" {
  const json: Array<any> | OBJ

  export = json
}

declare module "encodeurl"
declare module "serve-static"
declare module "verifications"

declare interface OBJ {
  [key: string]: any
}
