import * as connect from "./connect";

declare module connections { }

function connections(connections: { [name: string]: connect.Connection }, force = false) {
  (connections as any).map((connection: connect.Connection, name: string) => {
    if (force || !__FOX__.db.connections[name])
      __FOX__.db.connections[name] = connect(connection);
  });
}

export = connections;
