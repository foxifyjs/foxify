const path = require('path')
const morgan = require('morgan')
const Foxify = require('../framework')
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
  .use(users)

// start the server
app.start(() => console.log(`Foxify server running at http://localhost:3000 (worker: ${process.pid})`))
