// 常量与错误代码定义

const Constants = {
    ERR_MASTER_SYS_ERROR: [-101, "Master system error"],
    ERR_MASTER_TT_LOGIN_FAILED: [-102, "tt jscode2session failed"],
    ERR_MASTER_UPDATE_OR_CREATE_USER_FAILED: [-103, "Update or create user failed"],
    ERR_MASTER_USER_INVALID_SESSION: [-104, "Invalid user session key, is it expired?"],
    ERR_MASTER_USER_FILTER_ERROR: [-105, "User filter error"],

    ERR_MASTER_API_NOT_FOUND: [101, "API not found"],
    ERR_MASTER_INVALID_REQ: [102, "Invalid request"],
};

module.exports = Constants;
