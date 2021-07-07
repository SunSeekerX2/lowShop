/*
* name：node.js通用工具方法模块
* author：SunSeekerX
* time：2019年3月18日10点34分
* */

// 导出
module.exports = {
    // 验证手机号码是否可用
    isPhoneAvailable: function (str) {
        return /^[1][3,4,5,6,7,8,9][0-9]{9}$/.test(str)
    },
    // 去除空格
    trim: function (str) {
        return str.replace(/^(\s|\u00A0)+/, '').replace(/(\s|\u00A0)+$/, '');
    },
    // 时间格式化
    dateFormat: function (date, fmt) {
        const o = {
            "M+": date.getMonth() + 1, //月份
            "d+": date.getDate(), //日
            "h+": date.getHours(), //小时
            "m+": date.getMinutes(), //分
            "s+": date.getSeconds(), //秒
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度
            "S": date.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }
}