const path = require('path')
const morgan = require('morgan')
const Foxify = require('../framework/Foxify')

// initiate database connections just once to make database integration way faster
// this should be called before requiring the models
Foxify.DB.connections({
  foxify: {
    database: process.env.DATABASE_NAME,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT
  }
})

// just because it uses 'User' model it should be called after 'Foxify.DB.connections'
const users = require('./routes/users')
const index = require('./routes/index')

let app = new Foxify()

// template engine support
app.engine('ejs', path.join(__dirname, 'views'), require('ejs').__express)

// static serve support
app.use(Foxify.static(path.join(__dirname, 'public')))

// express middleware support
app.use(morgan('dev'))

// add routes to app
app.use(index)
app.use(users)

// start the server
app.start()
