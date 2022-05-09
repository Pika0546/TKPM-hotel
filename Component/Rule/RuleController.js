const createError = require('http-errors');

const RuleService = require('./RuleService');
const PageUtil = require('../../utils/page');
const ObjectUtil = require('../../utils/object');

const maximumPagination = 5;
const limit = 5;

let currentGuestTypePage = 1;
let totalGuestTypePage = 1;
let totalGuestType = 0;

let currentRoomTypePage = 1;
let totalRoomTypePage = 1;
let totalRoomType = 0;

class RuleController{
    getRulePage = async (req, res, next) => {
        
        res.render('rule/index');
        
    } 
}

module.exports = new RuleController();