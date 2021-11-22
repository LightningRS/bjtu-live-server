const inspirecloud = require('@byteinspire/api');
const ObjectId = inspirecloud.db.ObjectId;

/**
 * LiveService
 * 直播业务实现
 */
class LiveService {
    /**
     * 获取教室及其直播间信息
     * @param {String} params.sid 用户 Session ID
     * @param {String} params.roomId 教室 ID
     * @param {Object} resObj 返回结果对象
     */
    async getRoomInfo(params, resObj) {
        return;
    }
}

// 导出 Service 的实例
module.exports = new LiveService();
