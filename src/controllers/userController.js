/**
 * BJTU Live: User Controller
 */

const userService = require('../services/userService');

/**
 * UserController
 * 用户业务入口
 * Controller 是业务入口，由 HTTP 路由解析后调用
 */
class UserController {
    /**
     * 用户登录 (通过 Session)
     * @param req Express 的请求参数
     * @param res Express 的响应参数
     */
    async ttLogin(req, res) {
        const resBody = {
            error: 0
        };
        await userService.ttLogin(req.body, resBody);
        res.send(resBody);
    }

    /**
     * 用户登录 (Session 无效，新登录)
     * @param req Express 的请求参数
     * @param res Express 的响应参数
     */
    async ttNewLogin(req, res) {
        const resBody = {
            error: 0
        };
        await userService.ttNewLogin(req.body, resBody);
        res.send(resBody);
    }
}

// 导出 Controller 的实例
module.exports = new UserController();
