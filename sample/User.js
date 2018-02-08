const Model = require('../framework/database/Model')

class User extends Model {
}

User.prototype.connection = 'mirana'

User.schema = {
  first_name: String,
  last_name: String,
  email: String
}

User.hidden = [
  'password'
]

module.exports = User
