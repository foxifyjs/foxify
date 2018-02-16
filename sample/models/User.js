const {Model} = require('../../framework/database')

class User extends Model {
}

User.schema = {
  username: Model.types.string()
}

User.prototype.connection = 'foxify'

module.exports = User
