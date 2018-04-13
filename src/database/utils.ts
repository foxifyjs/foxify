export const getGetterName = (key: string) => `get${key.camelCase().capitalize()}Attribute`;

export const getSetterName = (key: string) => `set${key.camelCase().capitalize()}Attribute`;

export const makeTableName = (name: string) => `${name.snakeCase()}s`;
