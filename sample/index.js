const dotenv = require('dotenv')
const path = require('path')
const morgan = require('morgan')

dotenv.config({path: path.join(__dirname, '.env')})

const Fox = require('../framework/Fox')
const Route = require('../framework/routing').Route

Fox.DB.connections({
  mirana: {
    database: process.env.DATABASE_NAME,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT
  }
})

const User = require('./User')

let fox = new Fox()

fox.use(morgan('dev'))

let routes = new Route()

routes.get('/users', (req, res) => {
  User.find().toArray((err, users) => res.json({users}))
})

routes.get('/user', async (req, res) => {
  res.json({
    user: await User.findOne()
  })
})

fox.use(routes)

fox.start()
