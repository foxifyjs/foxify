import * as Model from '../Model'
import * as Reference from './Reference'

declare module HasMany { }

class HasMany extends Reference {
  constructor(owner: typeof Model, model: typeof Model, localKey: string = '_id', foreignKey?: string, relation?: string | typeof Model) {
    foreignKey = foreignKey || `${owner.constructor.toString().slice(0, -1)}_id`

    super(model, localKey, foreignKey, relation)
  }

  stages(field: string) {
    return [
      {
        $lookup: {
          from: this.model.toString(),
          localField: this.localKey,
          foreignField: this.foreignKey,
          as: field
        }
      }
    ]
  }
}

export = HasMany
