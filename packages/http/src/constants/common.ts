export type JsonT =
  JsonT[] | boolean | number | string | { [ket: string]: JsonT } | null | undefined;

export type StringifyT = (
  value: any,
  replacer?: (key: string, value: any) => any,
  space?: number,
) => string;
