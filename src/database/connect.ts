import * as mongodb from 'mongodb'
import * as deasync from 'deasync'

declare module connect {
  export interface Connection {
    host?: string
    port?: string
    database: string
    user?: string
    password?: string
  }
}

function connect(connection: connect.Connection): mongodb.Db {
  let uri = 'mongodb://'

  if (connection.user && connection.password) {
    uri += `${
      connection.user
      }:${
      connection.password
      }@`
  }

  uri += `${
    connection.host || 'localhost'
    }:${
    connection.port || '27017'
    }/${
    connection.database
    }`

  let server = <mongodb.MongoClient>deasync(mongodb.MongoClient.connect)(uri)

  return server.db(connection.database)
}

export = connect
