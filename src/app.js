const path = require('path');
const apiRouter = require('./routers/apiRouter');
const Constants = require('./constants');
const counter = require('./utils/semWeekCounter');

const express = require('express');

const app = express();

// 全局配置
global.appConfig = {
    maxPageSize: 10,        // 最大单页数据量
};

// 为应用使用中间件
// 静态文件中间件
// app.use(express.static(path.join(__dirname, '../public')));
// 请求体 parse 中间件，用于 parse json 格式请求体
app.use(express.json());

// 为应用使用路由定义
// API 业务路由
app.use('/api', apiRouter);

// 将教学周、学期等的解析结果缓存为全局变量
counter.getToday().then((res) => {
    console.log('counter init', res);
});

// 若无匹配业务路由，则匹配 404 路由，代表访问路径不存在
app.use(notFound);
/** 若前面的路由抛错，则封装为错误响应返回
 * 错误响应格式为
 * {
 *   error: message
 * }
*/
app.use(errorHandler);

function notFound(req, res) {
    res.status(404);
    const [err, msg] = Constants.ERR_API_NOT_FOUND;
    res.send({
        error: err,
        msg: msg,
    });
}

function errorHandler(err, req, res, next) {
    // 抛出的错误可以附带 error、msg 字段，即错误代码和错误提示信息
    // 若包含 error 字段，默认状态码 200
    // 若不包含 error 字段，则默认状态码为 500，代表服务器内部错误
    console.log(err);
    res.status(err.error ? 200 : 500);
    if (!err.error) {
        const [err, msg] = Constants.ERR_SYSTEM_ERROR;
        err.error = err;
        err.msg = msg;
    }
    res.send({
        error: err.error,
        msg: err.msg
    });
}

// 导出 Express 对象
module.exports = app;
