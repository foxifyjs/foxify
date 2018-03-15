export function applyMixins(derivedCtor: any, baseCtors: any[]) {
  baseCtors.forEach((baseCtor) => {
    // static methods
    const forbidden = ["length", "prototype", "name"];
    Object.getOwnPropertyNames(baseCtor).forEach((name) => {

      if (forbidden.indexOf(name) === -1)
        derivedCtor[name] = baseCtor[name];
    });

    // instance methods
    Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {

      if (name !== "constructor")
        derivedCtor.prototype[name] = baseCtor.prototype[name];
    });
  });
}

export function applyAsStaticMixins(derivedCtor: any, baseCtors: any[]) {
  baseCtors.forEach((baseCtor) => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {

      if (name !== "constructor")
        derivedCtor[name] = baseCtor.prototype[name];
    });
  });
}

export function defineGetter(obj: object, name: string, getter: () => any) {
  Object.defineProperty(
    obj,
    name,
    {
      configurable: true,
      enumerable: true,
      get: getter,
    },
  );
}
