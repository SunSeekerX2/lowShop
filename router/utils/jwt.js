/*
*  name：token加密验证模块
*  author：SunSeekerX
*  time：2019年3月21日14点37分
*  dependencies：{
*    jsonwebtoken
*  }
* */
const jwt = require('jsonwebtoken'),
    mysql = require('./mysql'),
    secret = 'lowShop'// 密钥

module.exports = {
    getToken: function (id, userPhone, date) {
        // Token 载荷
        const payload = {
            id,
            userPhone,
            date
        }

        // 签发 Token
        const token = jwt.sign(payload, secret, {})
        return token
    },
    checkToken: function (token = 'default', table, callback) {
        if (token === 'default') {
            callback(false)
        } else {
            // 解码token
            jwt.verify(token, secret, (error, decoded) => {
                if (error) {
                    callback(false)
                } else {
                    const tokenDate = new Date(decoded.date).getTime() + (7 * 24 * 60 * 60 * 1000)
                    const nowDate = Date.now() // + (7*24*60*60*1000);
                    if (tokenDate < nowDate) {//token过期
                        callback(false)
                    } else {

                        // 时间验证通过，验证token是否正确
                        mysql.query({sql: 'SELECT token FROM ' + table + ' WHERE id = ? ', params: [decoded.id]})
                            .then(res => {
                                if (res[0].token !== token) {
                                    //console.log('111')
                                    // token验证失败
                                    callback(false)
                                } else {
                                    // token验证成功
                                    callback(true)
                                }
                            }, err => {
                                console.log('查询数据库token失败')
                                callback(false)
                            })
                    }
                }
            })
        }
    },
}

