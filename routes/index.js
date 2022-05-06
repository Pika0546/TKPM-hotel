const siteRouter = require('../Component/Site/SiteRouter')
const roomRouter = require('../Component/Room/RoomRouter')
const ruleRouter = require('../Component/Rule/RuleRouter')
const adminRouter = require('../Component/Admin/AdminRouter')
const billRouter = require('../Component/Bill/BillRouter')
const roomRentRouter = require('../Component/RoomRent/RoomRentRouter')
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
    app.use('/admin', adminRouter)
    app.use('/rule', ruleRouter)
    app.use('/rent-room-history', roomRentRouter)
    app.use('/bill', billRouter)
    app.use('/', siteRouter)
}

module.exports = route;
