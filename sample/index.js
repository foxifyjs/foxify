const dotenv = require('dotenv')
const path = require('path')
const microsecond = require('microseconds')

dotenv.config({path: path.join(__dirname, '.env')})

const Fox = require('../dist/Fox')
const Route = require('../dist/routing').Route
const User = require('./User')

Fox.connections({
  mirana: {
    database: process.env.DATABASE_NAME,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT
  }
})

let fox = new Fox()

const tst2 = function() {

  let users = User.find().toArray()
return users;
  // return users.toArray()
}

console.log('Initiating !')
for (let i = 0; i < 10; i++) {
  let t = microsecond.now()
  let result = tst2()
  // console.log(result.count())
  console.log(`sec ${i} -> `, Math.round((microsecond.now() - t) / 1000) + ' ms')
}

process.exit()

let routes = new Route()

routes.get('/', (req, res, next, foo) => {
  res.json({foo: 'bar'})
})

fox.use(routes)

// fox.use((req, res) => {
//   res.json({protocol: 'http'})
// })

fox.exec()
