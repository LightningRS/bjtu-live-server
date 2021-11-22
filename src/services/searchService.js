const courseTable = require('../models/courseTable');
const courseScheduleTable = require('../models/courseScheduleTable');
const roomTable = require('../models/roomTable');
const inspirecloud = require('@byteinspire/api');
const ObjectId = inspirecloud.db.ObjectId;

const counter = require('../utils/semWeekCounter');

/**
 * SearchService
 * 搜索业务实现
 * 支持搜索课程、搜索教室
 */
class SearchService {
    /**
     * 查询某一页课程
     * @param {Number} pageSize 每页数据量，取值范围 >= 1, 默认为 5
     * @param {Number} page 页号，取值范围 >= 1
     * @returns {Promise<Array<any>>} 返回课程信息
     */
    async listCourses(pageSize = 5, page = 1) {
        if (page < 1) page = 1;
        if (pageSize < 1) pageSize = 1;
        const st = (page - 1) * pageSize;
        const objs = await courseTable.where().skip(st).limit(pageSize).find();
        return objs;
    }

    /**
     * 关键词搜索教室
     * @param {Number} params.pageSize 每页数据量，取值范围 >= 1, 默认为 5
     * @param {Number} params.page 页号，取值范围 >= 1
     * @param {String} params.keyword 关键词
     * @returns {Promise<Array<any>>} 返回课程信息
     * @returns 
     */
    async searchRooms(params) {
        if (!params.page || params.page < 1)
            params.page = 1;
        if (!params.pageSize)
            params.pageSize = 5;
        else if (params.pageSize < 1)
            params.pageSize = 1;
        else if (params.pageSize > global.appConfig.maxPageSize)
            params.pageSize = global.appConfig.maxPageSize;
        const st = (params.page - 1) * params.pageSize;

        // TODO: 关键词转正则表达式，可能需要有效性过滤
        let keywordRegStr = !params.keyword ? '' : params.keyword
            .trim()
            .replace(/([\[\]\(\)\.\*\$\+\?\\\^\{\}\|])/ig, '\\$1')
            .replace(' ', '\(\.\*\)');
        const keywordReg = eval('/' + keywordRegStr + '/ig');
        console.log('searchRooms.keywordReg', keywordReg);

        const filters = {};
        if (keywordRegStr !== '') filters.roomName = keywordReg;

        const rooms = await roomTable.where(filters)
            .skip(st).limit(params.pageSize)
            .populate('schedules').find();

        // 获取当前课程节数
        const currentSeq = counter.getCurrentCourseSeq();

        // 获取今日教学周解析结果
        const todayObj = await counter.getToday();

        // 判断 schedules 中当前时间的课程
        for (let i = 0; i < rooms.length; i++) {
            const room = rooms[i];
            const schedules = room.schedules;
            for (let j = 0; j < schedules.length; j++) {
                const item = schedules[j];
                const cond =
                    (item.weeknum.indexOf(',' + todayObj.schoolWeek + ',') !== -1) &&
                    (item.weekday === todayObj.weekday.toString()) &&
                    (item.time.indexOf(',' + currentSeq + ',') !== -1);
                if (cond) {
                    // 联合查询课程
                    const course = await courseTable
                        .where({ id: item.courseId }).find();
                    room.currentCourse = course[0];
                    room.currentSchedule = item;
                }
            }
            room.schedules = undefined;
        }
        return rooms;
    }

    /**
     * 关键词搜索课程
     * @param {Number} params.pageSize 每页数据量，取值范围 >= 1, 默认为 5
     * @param {Number} params.page 页号，取值范围 >= 1
     * @param {String} params.keyword 关键词
     * @returns {Promise<Array<any>>} 返回课程信息
     * @returns 
     */
    async searchCourses(params) {
        if (!params.page || params.page < 1)
            params.page = 1;
        if (!params.pageSize)
            params.pageSize = 5;
        else if (params.pageSize < 1)
            params.pageSize = 1;
        else if (params.pageSize > global.appConfig.maxPageSize)
            params.pageSize = global.appConfig.maxPageSize;
        const st = (params.page - 1) * params.pageSize;

        // TODO: 关键词转正则表达式，可能需要有效性过滤
        let keywordRegStr = !params.keyword ? '' : params.keyword
            .trim()
            .replace(/([\[\]\(\)\.\*\$\+\?\\\^\{\}\|])/ig, '\\$1')
            .replace(' ', '\(\.\*\)');
        const keywordReg = eval('/' + keywordRegStr + '/ig');
        console.log('keywordReg', keywordReg);

        // TODO: 教师转正则表达式，可能需要有效性过滤
        let tecRegStr = !params.teachers ? '' : params.teachers
            .trim()
            .replace(/([\[\]\(\)\.\*\$\+\?\\\^\{\}\|])/ig, '\\$1')
            .replace(' ', '\(\.\*\)');
        const tecReg = eval('/' + tecRegStr + '/ig');
        console.log('tecReg', tecReg);

        const filters = {};
        if (keywordRegStr !== '') filters.courseName = keywordReg;
        if (tecRegStr !== '') filters.teachers = tecReg;

        // 其它条件，尚未做规则检查
        if (params.department) filters.department = params.department;
        if (params.term) filters.term = params.term;
        if (params.isFullTime) filters.isFullTime = params.isFullTime;
        if (params.status) filters.status = params.status;
        if (params.credit) filters.credit = params.credit;

        const courses = await courseTable.where(filters)
            .skip(st).limit(params.pageSize).find();

        // 获取当前课程节数
        const currentSeq = counter.getCurrentCourseSeq();

        // 获取今日教学周解析结果
        const todayObj = await counter.getToday();

        // 联合查询教室
        for (let i = 0; i < courses.length; i++) {
            const schedules = await courseScheduleTable
                .where({ courseId: courses[i].id })
                .projection({
                    room: 1, roomId: 1, time: 1, weekday: 1, weeknum: 1,
                })
                .find();
            schedules.forEach((item, i) => {
                // 教学周、星期、节次相等，则为正在进行的课程
                item.isNow =
                    (item.weeknum.indexOf(',' + todayObj.schoolWeek + ',') !== -1) &&
                    (item.weekday === todayObj.weekday.toString()) &&
                    (item.time.indexOf(',' + currentSeq + ',') !== -1);
            });
            courses[i].classrooms = schedules;
        }
        return courses;
    }
}

// 导出 Service 的实例
module.exports = new SearchService();
