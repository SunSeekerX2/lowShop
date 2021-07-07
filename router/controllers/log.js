const code = require('../utils/code'),
    mysql = require('../utils/mysql');

class Log{
    static async accessLog(headers){
        if (headers) {
            const sqlobj = {
                sql: 'INSERT INTO `webapp_access_log`(`host`, `origin`, `userAgent`, `accept`, `referer`) VALUES (?, ?, ?, ?, ?)',
                params: [
                    headers.host,
                    headers.origin,
                    headers['user-agent'],
                    headers.accept,
                    headers.referer
                ]
            }
            mysql.query(sqlobj)
                .then(data => {
                }, err => {
                    console.log('记录访问日志失败', 'time：' + util.dateFormat(new Date(), '"yyyy-MM-dd hh:mm:ss"') + ' 原因：' + err)
                })
        }
    }
}

module.exports = Log
