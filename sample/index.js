const path = require('path')
const morgan = require('morgan')
const Fox = require('../framework/Fox')

// initiate database connections just once to make database integration way faster
// this should be called before requiring the models
Fox.DB.connections({
  foxify: {
    database: process.env.DATABASE_NAME,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT
  }
})

// just because it uses 'User' model it should be called after 'Fox.DB.connections'
const users = require('./routes/users')
const index = require('./routes/index')

let app = new Fox()

// template engine support
app.engine('ejs', path.join(__dirname, 'views'), require('ejs').__express)

// static serve support
app.use(Fox.static(path.join(__dirname, 'public')))

// express middleware support
app.use(morgan('dev'))

// add routes to app
app.use(index)
app.use(users)

// start the server
app.start()
