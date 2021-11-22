/**
 * BJTU Live: API Router
 */

const express = require('express');
const router = express.Router();

const searchController = require('../controllers/searchController');
const slaveController = require('../controllers/slaveController');
const liveController = require('../controllers/liveController');
const userController = require('../controllers/userController');

// Express 是通过 next(error) 来表达出错的，无法识别 async 函数抛出的错误
// wrap 函数的作用在于将 async 函数抛出的错误转换为 next(error)
function wrap(handler) {
    return async (req, res, next) => {
        try {
            await handler(req, res, next);
        } catch (e) {
            next(e);
        }
    };
}

// 组装路由
// ------------- debug -------------
// ------------ ./debug ------------

// 搜索业务
router.post('/course/list', wrap(searchController.listCourses));
router.post('/search/room', wrap(searchController.searchRoom));
router.post('/search/course', wrap(searchController.searchCourse));

// 聊天子服务器业务
router.post('/slave/getUserInfo', wrap(slaveController.getUserInfo));

// 用户业务
router.post('/user/ttLogin', wrap(userController.ttLogin));
router.post('/user/ttNewLogin', wrap(userController.ttNewLogin));

// 直播业务
router.post('/live/getRoomInfo', wrap(liveController.getRoomInfo));

module.exports = router;
