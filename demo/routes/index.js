const Foxify = require('../../framework')

let routes = new Foxify.Route()

routes.get('/', (req, res) => {
  res.render('index', {
    logo: 'https://avatars1.githubusercontent.com/u/36167886?s=200&v=4',
    title: 'Foxify'
  })
})

routes.get('/greet/', (req, res) => {
  res.json({
    hello: 'world'
  })
})

const schema = {
  response: {
    200: {
      type: 'object',
      properties: {
        hello: {
          type: 'string'
        }
      }
    }
  }
};

routes.get('/greet-fast', {
  schema
}, (req, res) => {
  res.json({
    hello: 'world'
  })
})

routes.get('/404', (req, res) => {
  throw new HttpException(404)
})

routes.get('/error', async (req, res) => {
  throw new Error('Oops!')
})

module.exports = routes