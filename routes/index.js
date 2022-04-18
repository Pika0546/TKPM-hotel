const siteRouter = require('../Component/Site/SiteRouter')
const roomRouter = require('../Component/Room/RoomRouter')

function route(app){
    app.use('/', siteRouter)
    app.use('/room', roomRouter)
}

module.exports = route;
