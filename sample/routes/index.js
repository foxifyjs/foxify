const Fox = require('../../framework')

let routes = new Fox.Route()

routes.get('/', (req, res) => {
  res.render('index', {
    logo: 'https://avatars1.githubusercontent.com/u/36167886?s=200&v=4',
    title: 'Foxify'
  })
})

routes.get('/greet', (req, res) => {
  res.json({hello: 'world'})
})

module.exports = routes
