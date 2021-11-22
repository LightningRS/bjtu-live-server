/**
 * BJTU Live: API Controller
 */

const searchService = require('../services/searchService');

/**
 * APIController
 * Controller 是业务入口，由 HTTP 路由解析后调用
 * 包含各项功能
 */
class APIController {
    /**
     * 搜索课程
     * @param req Express 的请求参数
     * @param res Express 的响应参数
     */
    async searchCourse(req, res) {
        const resBody = {
            error: 0,
            result: null,
        };
        const result = await searchService.searchCourses(req.body);
        resBody.result = result;
        res.send(resBody);
    }

    /**
     * 搜索教室
     * @param req Express 的请求参数
     * @param res Express 的响应参数
     */
    async searchRoom(req, res) {
        const resBody = {
            error: 0,
            result: null,
        };
        const result = await searchService.searchRooms(req.body);
        resBody.result = result;
        res.send(resBody);
    }

    /**
     * 列出课程
     * @param req Express 的请求参数
     * @param res Express 的响应参数
     */
    async listCourses(req, res) {
        let resBody = {
            error: 0,
            result: null,
        };
        const result = await searchService.listCourses(5, req.body.page);
        resBody.result = result;
        res.send(resBody);
    }
}

// 导出 Controller 的实例
module.exports = new APIController();
