const Model = require('../framework/database/Model')

class User extends Model {
}

User.prototype.connection = 'mirana'

module.exports = (new User())
