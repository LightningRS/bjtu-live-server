const inspirecloud = require('@byteinspire/api');
const ObjectId = inspirecloud.db.ObjectId;

/**
 * UserService
 * 用户业务实现
 */
class UserService {
    /**
     * 用户登录 (通过 Session)
     * @param {String} params.sid 用户 Session ID
     * @param {Object} resObj 返回结果对象
     */
    async ttLogin(params, resObj) {
        return;
    }
    
    /**
     * 用户登录 (Session 无效时新登录)
     * @param {String} params.code 用户 code
     * @param {String} params.userInfo 用户信息 (客户端获取)
     * @param {Object} resObj 返回结果对象
     */
    async ttNewLogin(params, resObj) {
        return;
    }
    
    /**
     * 聊天服务器请求用户信息
     * @param {String} params.sid 用户 Session ID
     * @param {Object} resObj 返回结果对象
     */
    async slaveGetUserInfo(params, resObj) {
        return;
    }
}

// 导出 Service 的实例
module.exports = new UserService();
