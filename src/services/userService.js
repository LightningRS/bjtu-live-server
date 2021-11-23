const inspirecloud = require('@byteinspire/api');
const ObjectId = inspirecloud.db.ObjectId;
const redis = inspirecloud.redis;
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

const Constants = require('../constants');
const userTable = require('../models/userTable');

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
        if (!params.sid) {
            resObj.error = Constants.ERR_MASTER_INVALID_REQ[0];
            resObj.msg = "missing sid";
            return;
        }

        const userStr = await redis.get(params.sid);
        if (!userStr) {
            [ resObj.error, resObj.msg ] = Constants.ERR_MASTER_USER_INVALID_SESSION;
            return;
        }

        // 轻服务 Redis 不支持 GETEX? 只能使用 get 后再 set 代替？
        await redis.set(params.sid, userStr, 'EX', global.appConfig.sessionExpires);
        console.log('userStr', userStr);
        resObj.userInfo = JSON.parse(userStr).userInfo;
        return;
    }
    
    /**
     * 用户登录 (Session 无效时新登录)
     * @param {String} params.code 用户 code
     * @param {String} params.userInfo 用户信息 (客户端获取)
     * @param {Object} resObj 返回结果对象
     */
    async ttNewLogin(params, resObj) {
        if (!params.code || !params.userInfo) {
            resObj.error = Constants.ERR_MASTER_INVALID_REQ[0];
            resObj.msg = "missing " + (!params.code ? 'code' : 'userInfo');
            return;
        }

        // 请求 toutiao API
        let res = null;
        try {
            res = await axios.post('https://developer.toutiao.com/api/apps/v2/jscode2session', {
                appid: global.appConfig.ttAppId,
                secret: global.appConfig.ttSecret,
                code: params.code,
            });
            if (res.data.err_no) {
                console.log('code2Session response invalid', res);
                [ resObj.error, resObj.msg ] = Constants.ERR_MASTER_TT_LOGIN_FAILED;
                return;
            }
            console.log('code2Session res', res.data);
        } catch (err) {
            console.log('request code2Session failed', err);
            [ resObj.error, resObj.msg ] = Constants.ERR_MASTER_TT_LOGIN_FAILED;
            return;
        }

        // 建立或更新用户
        const ttRes = res.data;
        const userObj = {
            uid: ttRes.data.unionid,
            sessionKey: ttRes.data.session_key,
            openid: ttRes.data.openid,
            nickName: params.userInfo.nickName ? params.userInfo.nickName : '默认昵称',
        };
        let userItem = await userTable.where({ uid: userObj.uid }).findOne();
        if (!userItem) {
            userItem = userTable.create(userObj);
        } else {
            console.log("Update user", userItem);
            Object.assign(userItem, userObj);
        }
        await userTable.save(userItem);

        // 建立 Session
        let sid = uuidv4();
        while (await redis.get(sid)) {
            sid = uuidv4();
        }
        const sessionObj = {};
        Object.assign(sessionObj, userObj);
        sessionObj.userInfoRaw = params.userInfo;
        sessionObj.userInfo = {
            uid: userObj.uid,
            uNick: userObj.nickName,
            uLevel: 1,
            isVip: false,
        };
        await redis.set(sid, JSON.stringify(sessionObj), 'EX', global.appConfig.sessionExpires);

        resObj.sid = sid;
        return;
    }
}

// 导出 Service 的实例
module.exports = new UserService();
