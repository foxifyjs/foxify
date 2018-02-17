const {Model} = require('../../framework/database')

class User extends Model {
}

User.schema = {
  name: Model.types.object().keys({
    first: Model.types.string().alphanum().required(),
    last: Model.types.string()
  }),
  username: Model.types.string().required()
}

// User.prototype.connection = 'foxify'

module.exports = User
