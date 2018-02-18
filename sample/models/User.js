const {Model} = require('../../framework/database')

class User extends Model {
}

User.schema = {
  name: {
    first: Model.types.String.min(3).required.default('Ardalan'),
    last: Model.types.String.min(3).max(20).required
  },
  username: Model.types.String.required
}

module.exports = User
