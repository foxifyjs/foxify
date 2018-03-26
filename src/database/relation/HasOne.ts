import Model from "../Model";
import * as Reference from "./Reference";

declare module HasOne { }

class HasOne extends Reference {
  constructor(
    owner: typeof Model,
    model: typeof Model,
    localKey?: string,
    foreignKey: string = "_id",
    relation?: string | typeof Model,
  ) {
    localKey = localKey || `${model.toString().slice(0, -1)}_id`;

    super(model, localKey, foreignKey, relation);
  }

  stages(field: string) {
    return [
      {
        $lookup: {
          from: this.model.toString(),
          localField: this.localKey,
          foreignField: this.foreignKey,
          as: field,
        },
      },
      { $unwind: { path: `$${field}`, preserveNullAndEmptyArrays: true } },
    ];
  }
}

export = HasOne;
