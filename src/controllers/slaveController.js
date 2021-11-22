/**
 * BJTU Live: Slave Controller
 */

const slaveService = require('../services/liveService');

/**
 * SlaveController
 * 聊天子服务器业务入口
 * Controller 是业务入口，由 HTTP 路由解析后调用
 */
class SlaveController {
    /**
     * 聊天服务器请求用户信息
     * @param req Express 的请求参数
     * @param res Express 的响应参数
     */
    async getUserInfo(req, res) {
        const resBody = {
            error: 0,
        };
        await slaveService.getUserInfo(req.body, resBody);
        res.send(resBody);
    }
}

// 导出 Controller 的实例
module.exports = new SlaveController();
