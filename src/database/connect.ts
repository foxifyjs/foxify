import * as mongodb from 'mongodb'
import * as deasync from 'deasync'

declare module connect {
  export interface Connection {
    database: string
    user: string
    password: string
    host: string
    port: string
  }
}

function connect(connection: connect.Connection): mongodb.Db {
  let uri = `mongodb://${
    connection.user
    }:${
    connection.password
    }@${
    connection.host
    }:${
    connection.port
    }/${
    connection.database
    }`

  let server = <mongodb.MongoClient>deasync(mongodb.MongoClient.connect)(uri)

  return server.db(connection.database)
}

export = connect
