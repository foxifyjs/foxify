const Fox = require('../../framework')
const {Route} = require('../../framework/routing')
const {ObjectId} = require('../../framework/database')
const User = require('../models/User')

// set prefix to '/users'
let routes = new Route('/users')

routes.get('/', (req, res) => {
  User.find().toArray((err, users) => {
    res.render('users', {
      title: "Foxify EJS example",
      users
    })
  })
})

routes.get('/:id', async (req, res, next, userId) => {
  await User.insertOne({username: '12'}) // TODO remove this
  let user = await User.findOne({_id: ObjectId(userId)})

  if (!user) throw new HttpExeption('User Not Found', Fox.constants.http.NOT_FOUND)

  res.json({user})
})

module.exports = routes
