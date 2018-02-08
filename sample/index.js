const dotenv = require('dotenv')
const path = require('path')
const microsecond = require('microseconds')
const morgan = require('morgan')

dotenv.config({path: path.join(__dirname, '.env')})

const Fox = require('../framework/Fox')
const Route = require('../framework/routing').Route
const User = require('./User')

Fox.db.connections({
  mirana: {
    database: process.env.DATABASE_NAME,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT
  }
})

let fox = new Fox()

fox.use(morgan('dev'))

// const tst2 = function() {
//   let users = User.find().toArray()
// return users;
//   // return users.toArray()
// }
//
// console.log('Initiating !')
// for (let i = 0; i < 10; i++) {
//   let t = microsecond.now()
//   let result = tst2()
//   // console.log(result)
//   console.log(`sec ${i} -> `, Math.round((microsecond.now() - t) / 1000) + ' ms')
// }
//
// process.exit()

let routes = new Route()

routes.get('/users', async (req, res) => {
  // User.find().toArray((err, users) => res.json({users}))

  res.json({
    users: await User.find().toArray()
  })
})

routes.get('/user', async (req, res) => {
  res.json({
    user: await User.findOne()
  })
})

fox.use(routes)

// fox.use((req, res) => {
//   res.json({protocol: 'http'})
// })

fox.start()
