const {Model} = require('../../framework/database')

class User extends Model {
}

User.prototype.connection = 'foxify'

module.exports = (new User())
