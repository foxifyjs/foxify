const Fox = require('../../framework/Fox')
const {Route} = require('../../framework/routing')
const {ObjectId} = require('../../framework/database')
const User = require('../models/User')

let routes = new Route()

routes.get('/users/:id', async (req, res, next, userId) => {
  let user = await User.findOne({_id: ObjectId(userId)})

  if (!user) throw new HttpExeption('User Not Found', Fox.constants.http.NOT_FOUND)

  res.json({user})
})

routes.get('/users', (req, res) => {
  User.find().toArray((err, users) => {
    res.render('users', {
      users: users,
      title: "Foxify EJS example",
      header: "Users"
    })
  })
})

module.exports = routes
