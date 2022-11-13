import {
  METHODS,
  Request as RequestT,
  Response as ResponseT,
} from "@foxify/http";
import Node from "./Node.js";
import { RoutesT } from "./constants.js";

// eslint-disable-next-line @typescript-eslint/no-shadow
function color(string: string, color: COLOR): string {
  return `${ color }${ string }\x1b[0m`;
}

const enum COLOR {
  YELLOW = "\x1b[33m",
  MAGENTA = "\x1b[35m",
  CYAN = "\x1b[36m",
}

export function assignMatchAllNode<
  Request extends RequestT = RequestT,
  Response extends ResponseT = ResponseT,
>(
  node: Node<Request, Response>,
  matchAllNode?: Node<Request, Response>,
  check = false,
): void {
  const { children, childrenCount } = node;

  const labels = Object.keys(children);

  if (check && labels.includes("*")) return;

  for (let i = 0; i < childrenCount; i++) {
    const child = children[labels[i]]!;

    child.matchingWildcardNode = matchAllNode;

    assignMatchAllNode(child, matchAllNode, true);
  }
}

export function assignParamNode<
  Request extends RequestT = RequestT,
  Response extends ResponseT = ResponseT,
>(node: Node<Request, Response>, paramNode?: Node<Request, Response>): void {
  const { children } = node;

  const labels = Object.keys(children).filter(label => label !== ":");

  // eslint-disable-next-line @typescript-eslint/prefer-for-of
  for (let i = 0; i < labels.length; i++) {
    const child = children[labels[i]]!;

    child.neighborParamNode = paramNode;
  }
}

export function routes<
  Request extends RequestT = RequestT,
  Response extends ResponseT = ResponseT,
>(node: Node<Request, Response>, prefix = ""): RoutesT<Request, Response> {
  const {
    prefix: nodePath,
    children,
    childrenCount,
    handlers,
    methods,
    options,
  } = node;

  const path = `${ prefix }${ nodePath }`;

  let result: RoutesT<Request, Response> = [];

  for (const method of methods) result.push([method, path, options[method], handlers[method]!]);


  const labels = Object.keys(children);

  for (let i = 0; i < childrenCount; i++) result = result.concat(routes(children[labels[i]]!, path));


  return result;
}

export function prettyPrint(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  node: Node<any, any>,
  prefix = "",
  tail = false,
): string {
  const { prefix: path, children, childrenCount, methods } = node;

  let tree = `${ prefix }${ color(tail ? "└── " : "├── ", COLOR.YELLOW) }${ path }`;

  if (methods.length > 0) {
    if (methods.length === METHODS.length) {
      tree += ` ${ color("[", COLOR.MAGENTA) }${ color("*", COLOR.CYAN) }${ color(
        "]",
        COLOR.MAGENTA,
      ) }`;
    } else {
      tree += ` ${ color("[", COLOR.MAGENTA) }${ color(
        methods.join(","),
        COLOR.CYAN,
      ) }${ color("]", COLOR.MAGENTA) }`;
    }
  }

  prefix = `${ prefix }${ color(tail ? "    " : "│   ", COLOR.YELLOW) }`;

  const labels = Object.keys(children).sort();

  for (let i = 0; i < childrenCount - 1; i++) tree += `\n${ prettyPrint(children[labels[i]]!, prefix, false) }`;


  if (childrenCount > 0) {
    tree += `\n${ prettyPrint(
      children[labels[childrenCount - 1]]!,
      prefix,
      true,
    ) }`;
  }

  return tree;
}
