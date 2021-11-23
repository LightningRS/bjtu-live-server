const inspirecloud = require('@byteinspire/api');
const ObjectId = inspirecloud.db.ObjectId;
const userService = require('./userService');

/**
 * SlaveService
 * 聊天子服务器业务实现
 */
class SlaveService {
    /**
     * 获取用户信息 (聊天子服务器)
     * @param {String} params.sid 用户 Session ID
     * @param {Object} resObj 返回结果对象
     */
    async getUserInfo(params, resObj) {
        return await userService.ttLogin(params, resObj);
    }
}

// 导出 Service 的实例
module.exports = new SlaveService();
