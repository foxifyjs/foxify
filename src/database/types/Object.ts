import TypeAny from "./Any";

class TypeObject extends TypeAny {
  protected _base(v: any) {
    if (Object.isInstance(v)) return null;

    return "Must be a object";
  }
}

export default TypeObject;
