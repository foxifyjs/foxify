const Model = require('../dist/database/Model').default

class User extends Model {
}

User.connection = 'mirana'

User.schema = {
  first_name: String,
  last_name: String,
  email: String
}

User.hidden = [
  'password'
]

module.exports = User
