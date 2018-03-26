import TypeAny from "./Any";
import TypeArray from "./Array";
import TypeBoolean from "./Boolean";
import TypeBuffer from "./Buffer";
import TypeDate from "./Date";
import TypeNumber from "./Number";
import TypeObject from "./Object";
import TypeObjectId from "./ObjectId";
import TypeString from "./String";

declare module Type {}

class Type {
  static get Any() {
    return new TypeAny();
  }

  static get Array() {
    return new TypeArray();
  }

  static get Boolean() {
    return new TypeBoolean();
  }

  static get Buffer() {
    return new TypeBuffer();
  }

  static get Date() {
    return new TypeDate();
  }

  static get Number() {
    return new TypeNumber();
  }

  static get Object() {
    return new TypeObject();
  }

  static get ObjectId() {
    return new TypeObjectId();
  }

  static get String() {
    return new TypeString();
  }
}

export = Type;
