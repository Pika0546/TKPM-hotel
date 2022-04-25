const siteRouter = require('../Component/Site/SiteRouter')
const roomRouter = require('../Component/Room/RoomRouter')
const accountRouter = require('./account')
function route(app){
    app.use('/account', accountRouter);
    // app.use(function(req, res, next){
    //     if(req.user){
    //         next();
    //     }else{
    //         res.redirect('/account/login');
    //     }
    // })
    app.use('/room', roomRouter)
    app.use('/', siteRouter)
}

module.exports = route;
