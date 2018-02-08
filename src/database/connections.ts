import * as connect from './connect'

declare module connections { }

function connections(connections: { [name: string]: connect.Connection }) {
  (connections as any).map((connection: connect.Connection, name: string) => {
    __FOX__.db.connections[name] = connect(connection)
  })
}

export = connections
