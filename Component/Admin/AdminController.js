const createError = require('http-errors');
const AdminService = require("./AdminService");
const PageUtil = require('../../utils/page');

const maximumPagination = 5;
let currentPage = 1;
let totalPage = 1;
let totalAdmin = 0;
const limit = 5;

class AdminController{
    //[GET] /login
    getLoginPage(req, res, next){
        res.render('account/login', {
            layout:false,
            message: req.flash('error'),
        });
    }

    //[POST] /logout
    logout(req, res, next){
        req.logout();
        res.redirect('/');
    }

    //[GET] /register
    getRegisterPage(req, res, next){
        res.render('account/register', {
            layout:false,
        });
    }

    //[GET] /password-recovery
    getPasswordRecoveryPage(req, res, next){
        res.render('account/forgot-password', {
            layout:false,
        });
    }


    async checkUsernameAPI(req,res,next){
        const {username} = req.body;
        try{
            const result = await AdminService.findAccountByUsername(username)
            if(result){
                res.status(200).json({isExisted: true});
            }
            else{
                res.status(200).json({isExisted: false});
            }
        }
        catch(err){
            onsole.log(error);
            res.status(500).json(error);
        }
    }

    fetchAdminListFromDB = async (req, res, next) => {
        const pageNumber = req.query.page;
        const fullname = req.query.fullname || null;
        currentPage = PageUtil.getCurrentPage(pageNumber,totalPage);
        const admin = await AdminService.getAdminList(limit, currentPage, fullname);
        totalAdmin = await AdminService.countAllAdmin(fullname);
        totalPage = Math.ceil(totalAdmin/limit);
        const paginationArray = PageUtil.getPaginationArray(currentPage, totalPage, maximumPagination);
        return {
            admin,
            page: currentPage,
            totalPage,
            totalAdmin,
            paginationArray,
            queryFullname: fullname,
            prevPage: (currentPage > 1) ? currentPage - 1 : 1,
            nextPage: (currentPage < totalPage) ? currentPage + 1 : totalPage,
        }
    }


    getAdminList = async (req, res, next) => {
        try {
            const adminListData = await this.fetchAdminListFromDB(req, res, next);
            res.render('admin/list', adminListData)
        } catch (error) {
            console.log(error);
            next(createError(500));
        }
    }

    getAdminListAPI = async (req, res, next) => {
        try {
            const adminListData = await this.fetchAdminListFromDB(req, res, next);
            res.status(200).json(adminListData)
        } catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    }

    getAdminCreate = async (req, res, next) => {
        res.render('admin/add')
    }

    getAdminDetail = async (req, res, next) => {
        res.render('admin/detail')
    }

}

module.exports = new AdminController();