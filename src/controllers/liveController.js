/**
 * BJTU Live: Live Controller
 */

const liveService = require('../services/liveService');

/**
 * LiveController
 * 直播业务入口
 * Controller 是业务入口，由 HTTP 路由解析后调用
 */
class LiveController {
    /**
     * 获取教室及其直播信息
     * @param req Express 的请求参数
     * @param res Express 的响应参数
     */
    async getRoomInfo(req, res) {
        const resBody = {
            error: 0
        };
        await liveService.getRoomInfo(req.body, resBody);
        res.send(resBody);
    }
}

// 导出 Controller 的实例
module.exports = new LiveController();
