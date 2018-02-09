const Fox = require('../../framework/Fox')

let routes = new Fox.Route()

routes.get('/', (req, res) => {
  res.render('index', {
    logo: 'https://avatars1.githubusercontent.com/u/36167886?s=200&v=4',
    title: 'Foxify'
  })
})

module.exports = routes
