const axios = require('axios');

class SemesterWeekCounter {
    async getToday() {
        /**
         * 获取今日日期、学年、学期、教学周等信息
         */
        const _this = this;
        if (global.semesterWeekCounter_todayParsed) {
            const cmp = new Date(global.semesterWeekCounter_todayParsed.dateObj.toLocaleDateString());
            const now = new Date(new Date().toLocaleDateString());
            if (cmp.getTime() === now.getTime()) {
                console.log('use cached global.semesterWeekCounter_todayParsed');
                return global.semesterWeekCounter_todayParsed;
            }
        }
        console.info('global.semesterWeekCounter_todayParsed invalid, fetch again');
        try {
            const res = await axios.get('https://bksy.bjtu.edu.cn/Admin/SemesterHandler.ashx');
            global.semesterWeekCounter_todayParsed = this.parseSemesterHandler(res.data);
            return global.semesterWeekCounter_todayParsed;
        } catch (err) {
            console.error('Error when requesting SemesterHandler', err);
        }
        return null;
    }

    parseSemesterHandler(str) {
        /**
         * 解析日期、学年、学期、教学周信息
         * @param {String} str 本科生院网站返回信息，
         * 示例：document.write('今天是：2021年11月22日 星期一 第一学期(2021-2022学年) 第11教学周');
         */
        const res = str.matchAll(/今天是：(.*)\s星期(.*)\s第(.*)学期\((.*)学年\)\s第(.*)教学周/ig);
        const resArr = Array.from(res)[0];

        if (resArr.length < 6) return null;
        const dateObj = new Date();
        const chnNum = {
            零: 0, 一: 1, 二: 2, 三: 3, 四: 4, 五: 5, 六: 6, 七: 7, 八: 8, 九: 9,
        };
        return {
            dateObj: dateObj,
            dateStr: resArr[1],
            weekday: dateObj.getDay(),
            schoolYear: resArr[4],
            semester: chnNum[resArr[3]],
            schoolWeek: parseInt(resArr[5]),
        }
    }
    getCurrentCourseSeq() {
        const dateObj = new Date();
        const TimeSchedule = [
            { st: new Date().setHours(8, 0, 0, 0), ed: new Date().setHours(9, 50, 0, 0) },
            { st: new Date().setHours(10, 10, 0, 0), ed: new Date().setHours(12, 0, 0, 0) },
            { st: new Date().setHours(12, 10, 0, 0), ed: new Date().setHours(14, 0, 0, 0) },
            { st: new Date().setHours(14, 10, 0, 0), ed: new Date().setHours(16, 0, 0, 0) },
            { st: new Date().setHours(16, 20, 0, 0), ed: new Date().setHours(18, 10, 0, 0) },
            { st: new Date().setHours(19, 0, 0, 0), ed: new Date().setHours(20, 50, 0, 0) },
            { st: new Date().setHours(21, 0, 0, 0), ed: new Date().setHours(21, 50, 0, 0) },
        ];
        let res = 0;
        TimeSchedule.some((item, i) => {
            if (dateObj.getTime() >= item.st && dateObj.getTime() <= item.ed) {
                res = i + 1;
                return true;
            }
        });
        return res;
    }
}

module.exports = new SemesterWeekCounter();
