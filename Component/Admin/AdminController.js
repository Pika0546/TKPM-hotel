const createError = require('http-errors');
const bcrypt = require('bcrypt');
const { SALT_BCRYPT } = require('../../config');
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
        for(let i = 0 ; i < admin.length; i++){
            admin[i].index = i + (currentPage-1)*limit + 1
        }
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
        res.render('admin/add',{
            message: req.flash('admin-add'),
        })
    }

    getAdminDetail = async (req, res, next) => {
        const {id}  = req.params;
        try {
            const admin = await AdminService.findAccountById(id);
            if(admin){
                delete admin.password
                console.log(admin)
                res.render('admin/detail', {
                    admin,
                    message: req.flash('admin-detail'),
                });
            }
            else{
                next(createError(404));
            }
          
        } catch (error) {
            console.log(error);
            next(createError(500));
        }
    }

    createAdmin = async (req, res, next) => {

        try {
            const {username, fullname, identity, address, password, confirmPassword} = req.body;
            console.log(username);
            const other = await AdminService.findAccountByUsername(username);
            console.log(other)
            if(!username ||
                !fullname ||
                !password ||
                !confirmPassword
            ){
                
                req.flash("admin-add", {success: false, message: "Đầu vào không hợp lệ!", data: {username, fullname, identity, address, password, confirmPassword}})
                res.redirect("/admin/add");
                return;
            }
            if(other){
                req.flash("admin-add", {success: false, message: "Tên đăng nhập đã tồn tại!", data: {username, fullname, identity, address, password, confirmPassword}})
                res.redirect("/admin/add");
                return;
            }
            if(password !== confirmPassword){
                req.flash("admin-add", {success: false, message: "Mật khẩu nhập lại phải trùng với mật khẩu!", data: {username, fullname, identity, address, password, confirmPassword}})
                res.redirect("/admin/add");
                return;
            }
            const hashPassword = await bcrypt.hash(password, SALT_BCRYPT)
            const resData = await AdminService.createAdmin(username, fullname, identity, address, hashPassword);
            req.flash("admin-detail", {success: true, message: "Tạo tài khoản thành công!"})
            res.redirect(`/admin/${resData.id}`);
        } catch (error) {
            console.log(error);
            next(createError(500));
        }
    }

}

module.exports = new AdminController();